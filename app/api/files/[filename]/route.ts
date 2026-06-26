import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import os from "os";

// Dev-only endpoint: serves files written to /tmp by storage.ts
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const { filename } = await params;

  // Prevent path traversal
  const safe = path.basename(filename);
  const filePath = path.join(os.tmpdir(), "pdf-converter", safe);

  try {
    const buffer = await fs.readFile(filePath);
    const contentType = safe.endsWith(".pdf") ? "application/pdf" : "text/html";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safe}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
