import { NextRequest, NextResponse } from "next/server";
import { convertHtmlToPdf, HtmlToPdfOptions, PageSize, MarginPreset } from "@/lib/html-to-pdf";

export const runtime = "nodejs";
export const maxDuration = 300;

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

    let html = htmlStr ?? "";
    if (file) {
      html = Buffer.from(await file.arrayBuffer()).toString("utf-8");
    }

    const pdfBuffer = await convertHtmlToPdf(html, options);

    return new NextResponse(pdfBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="output.pdf"',
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error("[html-to-pdf]", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Conversion failed. Please try again." },
      { status: 500 }
    );
  }
}
