import { NextRequest, NextResponse } from "next/server";
import { convertPdfToHtml, PdfToHtmlOptions } from "@/lib/pdf-to-html";

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_FREE_MB ?? "10");
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const optionsStr = formData.get("options") as string | null;

    if (!file) {
      return NextResponse.json({ error: "INVALID_FILE", message: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "FILE_TOO_LARGE", message: `Max file size is ${MAX_SIZE_MB} MB` },
        { status: 413 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "INVALID_FILE", message: "File must be a PDF" }, { status: 400 });
    }

    let options: PdfToHtmlOptions = { embedImages: true, responsiveCss: true, minify: false };
    if (optionsStr) {
      try { options = { ...options, ...JSON.parse(optionsStr) }; } catch {}
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { html } = await convertPdfToHtml(buffer, options);
    const htmlBuffer = Buffer.from(html, "utf-8");

    return new NextResponse(htmlBuffer, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": 'attachment; filename="output.html"',
        "Content-Length": String(htmlBuffer.length),
      },
    });
  } catch (err) {
    console.error("[pdf-to-html]", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Conversion failed. Please try again." },
      { status: 500 }
    );
  }
}
