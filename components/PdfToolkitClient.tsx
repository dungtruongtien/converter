"use client";

import { useState, useRef, useCallback } from "react";

type Tab = "merge" | "split" | "compress";

interface PdfFile {
  file: File;
  id: string;
  pages?: number;
}

interface Result {
  blobs: { blob: Blob; filename: string }[];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function PdfToolkitClient() {
  const [tab, setTab] = useState<Tab>("merge");
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [splitRange, setSplitRange] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (incoming: File[]) => {
    const pdfs = incoming.filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (pdfs.length === 0) { setError("Please select PDF files only."); return; }
    if (pdfs.some((f) => f.size > 100 * 1024 * 1024)) { setError("Maximum file size is 100 MB per PDF."); return; }
    setError(null);

    const { PDFDocument } = await import("pdf-lib");

    const newFiles: PdfFile[] = await Promise.all(
      pdfs.map(async (file) => {
        try {
          const buf = await file.arrayBuffer();
          const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
          return { file, id: uid(), pages: doc.getPageCount() };
        } catch {
          return { file, id: uid() };
        }
      })
    );

    setFiles((prev) => {
      if (tab === "split" || tab === "compress") return [newFiles[0]];
      return [...prev, ...newFiles];
    });
    setResult(null);
  }, [tab]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };
  const moveDown = (idx: number) => {
    setFiles((prev) => { if (idx >= prev.length - 1) return prev; const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a; });
  };

  const parseSplitRange = (input: string, total: number): number[][] => {
    const ranges: number[][] = [];
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes("-")) {
        const [s, e] = part.split("-").map(Number);
        if (isNaN(s) || isNaN(e) || s < 1 || e > total || s > e) throw new Error(`Invalid range "${part}". Pages must be between 1 and ${total}.`);
        ranges.push(Array.from({ length: e - s + 1 }, (_, i) => s + i - 1));
      } else {
        const n = Number(part);
        if (isNaN(n) || n < 1 || n > total) throw new Error(`Invalid page number "${part}". Must be between 1 and ${total}.`);
        ranges.push([n - 1]);
      }
    }
    return ranges;
  };

  const process = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");

      if (tab === "merge") {
        const merged = await PDFDocument.create();
        for (const pdfFile of files) {
          const buf = await pdfFile.file.arrayBuffer();
          const src = await PDFDocument.load(buf);
          const pages = await merged.copyPages(src, src.getPageIndices());
          pages.forEach((p) => merged.addPage(p));
        }
        const bytes = await merged.save();
        const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
        setResult({ blobs: [{ blob, filename: "merged.pdf" }] });

      } else if (tab === "split") {
        const buf = await files[0].file.arrayBuffer();
        const src = await PDFDocument.load(buf);
        const total = src.getPageCount();

        let ranges: number[][];
        if (!splitRange.trim()) {
          ranges = Array.from({ length: total }, (_, i) => [i]);
        } else {
          ranges = parseSplitRange(splitRange, total);
        }

        const blobs: { blob: Blob; filename: string }[] = [];
        for (let i = 0; i < ranges.length; i++) {
          const doc = await PDFDocument.create();
          const pages = await doc.copyPages(src, ranges[i]);
          pages.forEach((p) => doc.addPage(p));
          const bytes = await doc.save();
          const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
          const label = ranges.length === total ? `page-${ranges[i][0] + 1}` : `part-${i + 1}`;
          blobs.push({ blob, filename: `${files[0].file.name.replace(".pdf", "")}-${label}.pdf` });
        }
        setResult({ blobs });

      } else if (tab === "compress") {
        const buf = await files[0].file.arrayBuffer();
        const src = await PDFDocument.load(buf);
        const compressed = await PDFDocument.load(await src.save({ useObjectStreams: true }));
        const bytes = await compressed.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
        const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
        setResult({ blobs: [{ blob, filename: files[0].file.name.replace(".pdf", "-compressed.pdf") }] });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadOne = (item: { blob: Blob; filename: string }) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const downloadAll = () => {
    result?.blobs.forEach((item, i) => {
      setTimeout(() => downloadOne(item), i * 200);
    });
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setSplitRange("");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "merge", label: "Merge PDFs" },
    { id: "split", label: "Split PDF" },
    { id: "compress", label: "Compress PDF" },
  ];

  const singleFile = tab === "split" || tab === "compress";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm w-fit mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setFiles([]); setResult(null); setError(null); setSplitRange(""); }}
            className={`px-5 py-2.5 font-medium transition-colors ${
              tab === t.id ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* Upload zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">
            {singleFile ? "Drop a PDF here or click to browse" : "Drop PDFs here or click to browse"}
          </p>
          <p className="text-sm text-gray-400">PDF only · Max 100 MB{!singleFile ? " · Multiple files supported" : ""}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple={!singleFile}
            className="hidden"
            onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
          />
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, idx) => (
              <div key={f.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{f.file.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatBytes(f.file.size)}{f.pages ? ` · ${f.pages} page${f.pages !== 1 ? "s" : ""}` : ""}
                  </p>
                </div>
                {!singleFile && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
                <button onClick={() => removeFile(f.id)} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Split options */}
        {tab === "split" && files.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Page ranges <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={splitRange}
              onChange={(e) => setSplitRange(e.target.value)}
              placeholder="e.g. 1-3, 4, 5-7"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-2">
              Leave empty to split every page into a separate file. Use commas for multiple ranges: <code className="bg-gray-100 px-1 rounded">1-3, 4-6, 7</code>
            </p>
            {files[0]?.pages && (
              <p className="text-xs text-blue-600 mt-1">This PDF has {files[0].pages} pages.</p>
            )}
          </div>
        )}

        {/* Compress info */}
        {tab === "compress" && files.length > 0 && (
          <div className="bg-blue-50 rounded-xl border border-blue-100 px-4 py-3 text-sm text-blue-700">
            Compression removes redundant objects and uses object streams. Results vary by PDF content — typically 10–40% reduction for non-optimized PDFs. Scanned-image PDFs compress less.
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        {/* Action button */}
        {files.length > 0 && (
          <button
            onClick={process}
            disabled={processing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing…
              </>
            ) : (
              tab === "merge" ? `Merge ${files.length} PDF${files.length !== 1 ? "s" : ""}` :
              tab === "split" ? "Split PDF" :
              "Compress PDF"
            )}
          </button>
        )}

        {/* Result */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-green-800 text-sm">
                  {result.blobs.length === 1 ? "Done!" : `${result.blobs.length} files ready`}
                </p>
              </div>
              {result.blobs.length > 1 && (
                <button
                  onClick={downloadAll}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors"
                >
                  ⬇ Download All
                </button>
              )}
            </div>
            <div className="space-y-2">
              {result.blobs.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-green-100 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.filename}</p>
                    <p className="text-xs text-gray-500">{formatBytes(item.blob.size)}</p>
                  </div>
                  <button
                    onClick={() => downloadOne(item)}
                    className="flex-shrink-0 ml-3 text-sm text-green-700 hover:text-green-900 font-semibold"
                  >
                    ⬇ Download
                  </button>
                </div>
              ))}
            </div>
            {tab === "compress" && result.blobs[0] && files[0] && (
              <p className="text-xs text-green-700">
                {formatBytes(files[0].file.size)} → {formatBytes(result.blobs[0].blob.size)}
                {" "}({(((files[0].file.size - result.blobs[0].blob.size) / files[0].file.size) * 100).toFixed(1)}% reduction)
              </p>
            )}
            <button onClick={reset} className="text-xs text-green-600 hover:text-green-800 underline">
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
