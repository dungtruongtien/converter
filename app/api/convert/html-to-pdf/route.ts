import { NextRequest, NextResponse } from "next/server";
import { convertHtmlToPdf, HtmlToPdfOptions, PageSize, MarginPreset } from "@/lib/html-to-pdf";
import { uploadFile, getExpiry } from "@/lib/storage";
import { checkRateLimit } from "@/lib/rate-limit";
import { createJob, updateJob, generateJobId } from "@/lib/jobs";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const htmlStr = formData.get("html") as string | null;
    const optionsStr = formData.get("options") as string | null;

    if (!file && !htmlStr) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "Provide either an HTML file or raw HTML string" },
        { status: 400 }
      );
    }

    const isPro = false; // TODO: check auth

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const rateResult = await checkRateLimit(ip, isPro);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "Too many requests. Try again tomorrow.", reset: rateResult.reset },
        { status: 429 }
      );
    }

    let options: HtmlToPdfOptions = { pageSize: "A4", margins: "normal", landscape: false };
    if (optionsStr) {
      try {
        const parsed = JSON.parse(optionsStr);
        options = {
          pageSize: (parsed.pageSize as PageSize) ?? options.pageSize,
          margins: (parsed.margins as MarginPreset) ?? options.margins,
          landscape: parsed.landscape ?? options.landscape,
        };
      } catch {}
    }

    // Pro gate: only A4 for free tier
    if (!isPro && options.pageSize !== "A4") {
      return NextResponse.json(
        { error: "PRO_REQUIRED", message: "Custom page sizes require Pro plan" },
        { status: 402 }
      );
    }

    const jobId = generateJobId();
    createJob(jobId);

    void (async () => {
      try {
        updateJob(jobId, { status: "processing", step: "Loading HTML…", progress: 15 });

        let html = htmlStr ?? "";
        if (file) {
          const buf = Buffer.from(await file.arrayBuffer());
          html = buf.toString("utf-8");
        }

        updateJob(jobId, { step: "Launching browser…", progress: 35 });
        const pdfBuffer = await convertHtmlToPdf(html, options);

        updateJob(jobId, { step: "Saving PDF…", progress: 80 });
        const filename = `${jobId}.pdf`;
        const { url, size } = await uploadFile(pdfBuffer, filename, "application/pdf");

        const expiry = getExpiry(isPro);
        updateJob(jobId, {
          status: "done",
          step: "Done",
          progress: 100,
          outputUrl: url,
          outputSize: size,
          expiresAt: expiry.toISOString(),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Conversion failed";
        updateJob(jobId, { status: "failed", step: "Failed", error: message });
      }
    })();

    return NextResponse.json({ jobId, estimatedSeconds: 20 });
  } catch (err) {
    console.error("[html-to-pdf]", err);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: "An unexpected error occurred" }, { status: 500 });
  }
}
