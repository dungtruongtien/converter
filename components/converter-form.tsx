"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload-zone";

/* ─── PDF → HTML options ─── */
interface PdfToHtmlOptions {
  embedImages: boolean;
  responsiveCss: boolean;
  minify: boolean;
}

/* ─── HTML → PDF options ─── */
interface HtmlToPdfOptions {
  pageSize: "A4" | "Letter";
  margins: "normal" | "narrow" | "none";
  landscape: boolean;
  inputMode: "file" | "paste";
  pastedHtml: string;
}

type Mode = "pdf-to-html" | "html-to-pdf";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function ConverterForm({ mode }: { mode: Mode }) {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadBlob, setDownloadBlob] = useState<{ blob: Blob; filename: string } | null>(null);

  const [pdfOpts, setPdfOpts] = useState<PdfToHtmlOptions>({
    embedImages: true,
    responsiveCss: true,
    minify: false,
  });

  const [htmlOpts, setHtmlOpts] = useState<HtmlToPdfOptions>({
    pageSize: "A4",
    margins: "normal",
    landscape: false,
    inputMode: "file",
    pastedHtml: "",
  });

  const isPdf = mode === "pdf-to-html";

  const reset = () => {
    setFile(null);
    setDone(false);
    setError(null);
    setDownloadBlob(null);
    setConverting(false);
  };

  const handleSubmit = async () => {
    if (isPdf && !file) { setError("Please select a PDF file."); return; }
    if (!isPdf && htmlOpts.inputMode === "file" && !file) { setError("Please select an HTML file."); return; }
    if (!isPdf && htmlOpts.inputMode === "paste" && !htmlOpts.pastedHtml.trim()) {
      setError("Please paste some HTML."); return;
    }

    setError(null);
    setConverting(true);
    setDone(false);
    setDownloadBlob(null);

    try {
      const endpoint = isPdf ? "/api/convert/pdf-to-html" : "/api/convert/html-to-pdf";
      const body = new FormData();

      if (isPdf && file) {
        body.append("file", file);
        body.append("options", JSON.stringify(pdfOpts));
      } else {
        if (htmlOpts.inputMode === "file" && file) {
          body.append("file", file);
        } else {
          body.append("html", htmlOpts.pastedHtml);
        }
        body.append("options", JSON.stringify({
          pageSize: htmlOpts.pageSize,
          margins: htmlOpts.margins,
          landscape: htmlOpts.landscape,
        }));
      }

      const res = await fetch(endpoint, { method: "POST", body });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { message?: string }).message ?? "Something went wrong. Please try again.");
        setConverting(false);
        return;
      }

      const blob = await res.blob();
      const filename = isPdf ? "output.html" : "output.pdf";

      // Trigger download immediately
      triggerDownload(blob, filename);

      setDownloadBlob({ blob, filename });
      setConverting(false);
      setDone(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setConverting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">

        {/* ─── Left panel: file + options ─── */}
        <div className="space-y-6">
          {isPdf ? (
            <UploadZone
              accept=".pdf,application/pdf"
              maxSizeMb={10}
              label="Drop your PDF here, or click to browse"
              hint="Supports PDF up to 10 MB · Free"
              onFile={setFile}
            />
          ) : (
            <>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
                {(["file", "paste"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setHtmlOpts((o) => ({ ...o, inputMode: m }))}
                    className={[
                      "flex-1 py-2 font-medium transition-colors",
                      htmlOpts.inputMode === m
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {m === "file" ? "Upload file" : "Paste HTML"}
                  </button>
                ))}
              </div>

              {htmlOpts.inputMode === "file" ? (
                <UploadZone
                  accept=".html,.htm,text/html"
                  maxSizeMb={10}
                  label="Drop your HTML file here, or click to browse"
                  onFile={setFile}
                />
              ) : (
                <textarea
                  className="w-full h-48 rounded-xl border border-gray-200 p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={"<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello world</h1>\n  </body>\n</html>"}
                  value={htmlOpts.pastedHtml}
                  onChange={(e) => setHtmlOpts((o) => ({ ...o, pastedHtml: e.target.value }))}
                />
              )}
            </>
          )}

          {/* Options */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Options</h3>

            {isPdf ? (
              <>
                {(
                  [
                    { key: "embedImages", label: "Embed images (base64)" },
                    { key: "responsiveCss", label: "Responsive CSS" },
                    { key: "minify", label: "Minify output" },
                  ] as { key: keyof PdfToHtmlOptions; label: string }[]
                ).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfOpts[key] as boolean}
                      onChange={(e) => setPdfOpts((o) => ({ ...o, [key]: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-24 shrink-0">Page size</label>
                  <select
                    value={htmlOpts.pageSize}
                    onChange={(e) => setHtmlOpts((o) => ({ ...o, pageSize: e.target.value as "A4" | "Letter" }))}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 w-24 shrink-0">Margins</label>
                  <select
                    value={htmlOpts.margins}
                    onChange={(e) => setHtmlOpts((o) => ({ ...o, margins: e.target.value as "normal" | "narrow" | "none" }))}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal (1 inch)</option>
                    <option value="narrow">Narrow (0.5 inch)</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={htmlOpts.landscape}
                    onChange={(e) => setHtmlOpts((o) => ({ ...o, landscape: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Landscape orientation</span>
                </label>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              ⚠ {error}
            </div>
          )}

          {/* Submit / Reset */}
          {done ? (
            <button
              onClick={reset}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 active:scale-[0.99] transition-all"
            >
              ↩ Convert another file
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={converting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {converting ? "Converting…" : isPdf ? "Convert to HTML" : "Convert to PDF"}
            </button>
          )}

        </div>

        {/* ─── Right panel: status ─── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 min-h-[320px] flex flex-col">
          {converting && (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
              {/* Spinner */}
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Converting your file…</p>
                <p className="text-xs text-gray-400 mt-1">This can take 10–30 seconds for large files.</p>
              </div>
            </div>
          )}

          {done && downloadBlob && (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Done! Your download started automatically.</p>
                <p className="text-xs text-gray-400 mt-1">{downloadBlob.filename}</p>
              </div>
              <button
                onClick={() => triggerDownload(downloadBlob.blob, downloadBlob.filename)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download again
              </button>
            </div>
          )}

          {!converting && !done && (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-3">
              <span className="text-5xl">{isPdf ? "🌐" : "📄"}</span>
              <p className="text-sm">
                Your {isPdf ? "HTML" : "PDF"} will download automatically once conversion is complete.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
