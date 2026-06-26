"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/upload-zone";
import { ProgressBar, ProgressStep } from "@/components/progress-bar";
import { AdSlot } from "@/components/ad-slot";
import { formatBytes } from "@/lib/utils";

/* ─── PDF → HTML config ─── */
interface PdfToHtmlOptions {
  embedImages: boolean;
  responsiveCss: boolean;
  minify: boolean;
}

/* ─── HTML → PDF config ─── */
interface HtmlToPdfOptions {
  pageSize: "A4" | "Letter";
  margins: "normal" | "narrow" | "none";
  landscape: boolean;
  inputMode: "file" | "paste";
  pastedHtml: string;
}

type Mode = "pdf-to-html" | "html-to-pdf";

const PDF_STEPS = ["Uploading", "Parsing PDF structure", "Generating HTML", "Saving output"];
const HTML_STEPS = ["Uploading", "Loading HTML", "Launching browser", "Saving PDF"];

function stepsFromProgress(labels: string[], serverStep: string, progress: number): ProgressStep[] {
  return labels.map((label, i) => {
    const threshold = ((i + 1) / labels.length) * 100;
    if (progress >= threshold) return { label, status: "done" };
    if (progress >= (i / labels.length) * 100) return { label, status: "active" };
    return { label, status: "waiting" };
  });
}

export function ConverterForm({ mode }: { mode: Mode }) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [serverStep, setServerStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  // PDF→HTML options
  const [pdfOpts, setPdfOpts] = useState<PdfToHtmlOptions>({
    embedImages: true,
    responsiveCss: true,
    minify: false,
  });

  // HTML→PDF options
  const [htmlOpts, setHtmlOpts] = useState<HtmlToPdfOptions>({
    pageSize: "A4",
    margins: "normal",
    landscape: false,
    inputMode: "file",
    pastedHtml: "",
  });

  const isPdf = mode === "pdf-to-html";
  const stepLabels = isPdf ? PDF_STEPS : HTML_STEPS;

  const pollJob = useCallback(async (jobId: string) => {
    const maxAttempts = 60;
    let attempts = 0;
    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 1500));
      attempts++;
      try {
        const res = await fetch(`/api/job/${jobId}`);
        const data = await res.json();
        if (data.status === "done") {
          router.push(`/result/${jobId}`);
          return;
        }
        if (data.status === "failed") {
          setError(data.error ?? "Conversion failed. Please try again.");
          setConverting(false);
          return;
        }
        setProgress(data.progress ?? 0);
        setServerStep(data.step ?? "");
      } catch {}
    }
    setError("Conversion timed out. Please try again.");
    setConverting(false);
  }, [router]);

  const handleSubmit = async () => {
    if (isPdf && !file) { setError("Please select a PDF file."); return; }
    if (!isPdf && htmlOpts.inputMode === "file" && !file) { setError("Please select an HTML file."); return; }
    if (!isPdf && htmlOpts.inputMode === "paste" && !htmlOpts.pastedHtml.trim()) {
      setError("Please paste some HTML."); return;
    }

    setError(null);
    setConverting(true);
    setProgress(5);

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
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
        setConverting(false);
        return;
      }

      await pollJob(data.jobId);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setConverting(false);
    }
  };

  const steps = stepsFromProgress(stepLabels, serverStep, progress);

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
              {/* Input mode toggle */}
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
                  placeholder="<!DOCTYPE html>&#10;<html>&#10;  <body>&#10;    <h1>Hello world</h1>&#10;  </body>&#10;</html>"
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
                    <option value="Letter">Letter (Pro)</option>
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

          {/* Submit */}
          {!converting && (
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-[0.99] transition-all"
            >
              {isPdf ? "Convert to HTML" : "Convert to PDF"}
            </button>
          )}

          {/* Ad slot — sidebar */}
          <AdSlot slot="2345678901" format="rectangle" />
        </div>

        {/* ─── Right panel: progress or placeholder ─── */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 min-h-[320px] flex flex-col">
          {converting ? (
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-900 mb-6">Converting…</p>
              <ProgressBar steps={steps} percent={progress} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-3">
              <span className="text-5xl">{isPdf ? "🌐" : "📄"}</span>
              <p className="text-sm">
                Your {isPdf ? "HTML output" : "PDF"} will appear here after conversion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
