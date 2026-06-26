import { put, del } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";
import os from "os";

const USE_LOCAL = !process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Upload a buffer to Vercel Blob (or local /tmp in dev).
 * Returns a publicly accessible URL.
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; size: number }> {
  if (USE_LOCAL) {
    // Dev fallback: write to OS temp dir and serve via /api/files/[name]
    const tmpDir = path.join(os.tmpdir(), "pdf-converter");
    await fs.mkdir(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, filename);
    await fs.writeFile(filePath, buffer);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3005";
    return { url: `${appUrl}/api/files/${filename}`, size: buffer.length };
  }

  const blob = await put(filename, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: true,
  });

  return { url: blob.url, size: buffer.length };
}

/**
 * Delete a file from Vercel Blob (no-op in dev).
 */
export async function deleteFile(url: string): Promise<void> {
  if (USE_LOCAL) return;
  await del(url);
}

/**
 * Calculate expiry timestamp based on tier.
 */
export function getExpiry(isPro: boolean): Date {
  const hours = isPro ? 7 * 24 : parseInt(process.env.FILE_EXPIRY_HOURS ?? "1");
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}
