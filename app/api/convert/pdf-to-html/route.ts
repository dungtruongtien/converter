import { NextRequest, NextResponse } from "next/server";
import { convertPdfToHtml, PdfToHtmlOptions } from "@/lib/pdf-to-html";
import { uploadFile, getExpiry } from "@/lib/storage";
import { checkRateLimit } from "@/lib/rate-limit";
import { createJob, updateJob, generateJobId } from "@/lib/jobs";

const MAX_SIZE_FREE = parseInt(process.env.MAX_FILE_SIZE_FREE_MB ?? "10") * 1024 * 1024;
const MAX_SIZE_PRO = parseInt(process.env.MAX_FILE_SIZE_PRO_MB ?? "100") * 1024 * 1024;

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const optionsStr = formData.get("options") as string | null;

    if (!file) {
      return NextResponse.json({ error: "INVALID_FILE", message: "No file provided" }, { status: 400 });
    }

    const isPro = false; // TODO: check auth token / Stripe subscription
    const maxSize = isPro ? MAX_SIZE_PRO : MAX_SIZE_FREE;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "FILE_TOO_LARGE", message: `Max file size is ${isPro ? "100" : "10"} MB` },
        { status: 413 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "INVALID_FILE", message: "File must be a PDF" }, { status: 400 });
    }

    // Rate limiting — identify by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const rateResult = await checkRateLimit(ip, isPro);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "Too many requests. Try again tomorrow.", reset: rateResult.reset },
        { status: 429 }
      );
    }

    let options: PdfToHtmlOptions = { embedImages: true, responsiveCss: true, minify: false };
    if (optionsStr) {
      try { options = { ...options, ...JSON.parse(optionsStr) }; } catch {}
    }

    const jobId = generateJobId();
    createJob(jobId);

    // Run conversion in background (fire-and-forget)
    void (async () => {
      try {
        updateJob(jobId, { status: "processing", step: "Reading PDF…", progress: 10 });
        const buffer = Buffer.from(await file.arrayBuffer());

        updateJob(jobId, { step: "Parsing PDF structure…", progress: 30 });
        const { html, pageCount } = await convertPdfToHtml(buffer, options);

        updateJob(jobId, { step: "Saving output…", progress: 80 });
        const filename = `${jobId}.html`;
        const { url, size } = await uploadFile(Buffer.from(html), filename, "text/html");

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

    return NextResponse.json({ jobId, estimatedSeconds: 8 });
  } catch (err) {
    console.error("[pdf-to-html]", err);
    return NextResponse.json({ error: "INTERNAL_ERROR", message: "An unexpected error occurred" }, { status: 500 });
  }
}
