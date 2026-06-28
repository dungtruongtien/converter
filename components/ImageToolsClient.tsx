"use client";

import { useState, useRef, useCallback } from "react";

type Tab = "compress" | "convert" | "resize";
type OutputFormat = "jpeg" | "webp" | "png";

interface ImageFile {
  file: File;
  previewUrl: string;
  originalSize: number;
}

interface Result {
  blob: Blob;
  url: string;
  size: number;
  filename: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getSaving(original: number, output: number) {
  const pct = ((original - output) / original) * 100;
  return pct > 0 ? `${pct.toFixed(1)}% smaller` : `${Math.abs(pct).toFixed(1)}% larger`;
}

export default function ImageToolsClient() {
  const [tab, setTab] = useState<Tab>("compress");
  const [image, setImage] = useState<ImageFile | null>(null);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpeg");
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, WebP, GIF, etc.)");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Maximum size is 50 MB.");
      return;
    }
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setResizeWidth(String(img.naturalWidth));
      setResizeHeight(String(img.naturalHeight));
    };
    img.src = url;
    setImage({ file, previewUrl: url, originalSize: file.size });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const handleWidthChange = (val: string) => {
    setResizeWidth(val);
    if (maintainAspect && naturalSize && val) {
      const w = parseInt(val);
      if (!isNaN(w)) setResizeHeight(String(Math.round(w * naturalSize.h / naturalSize.w)));
    }
  };

  const handleHeightChange = (val: string) => {
    setResizeHeight(val);
    if (maintainAspect && naturalSize && val) {
      const h = parseInt(val);
      if (!isNaN(h)) setResizeWidth(String(Math.round(h * naturalSize.w / naturalSize.h)));
    }
  };

  const process = async () => {
    if (!image) return;
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
        img.src = image.previewUrl;
      });

      let canvasW = img.naturalWidth;
      let canvasH = img.naturalHeight;

      if (tab === "resize") {
        const w = parseInt(resizeWidth);
        const h = parseInt(resizeHeight);
        if (!w || !h || w <= 0 || h <= 0) throw new Error("Enter valid width and height.");
        if (w > 8000 || h > 8000) throw new Error("Maximum dimension is 8000px.");
        canvasW = w;
        canvasH = h;
      }

      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvasW, canvasH);

      const mime =
        tab === "convert"
          ? `image/${outputFormat}`
          : tab === "compress"
          ? "image/jpeg"
          : image.file.type || "image/jpeg";

      const q = tab === "compress" ? quality / 100 : tab === "convert" && outputFormat !== "png" ? quality / 100 : undefined;

      const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Conversion failed"))), mime, q);
      });

      const ext =
        tab === "convert" ? outputFormat :
        tab === "compress" ? "jpg" :
        image.file.name.split(".").pop() ?? "jpg";

      const baseName = image.file.name.replace(/\.[^.]+$/, "");
      const suffix = tab === "compress" ? "-compressed" : tab === "resize" ? "-resized" : `-converted`;
      const filename = `${baseName}${suffix}.${ext}`;

      setResult({ blob, url: URL.createObjectURL(blob), size: blob.size, filename });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.filename;
    a.click();
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setNaturalSize(null);
    setResizeWidth("");
    setResizeHeight("");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "compress", label: "Compress" },
    { id: "convert", label: "Convert Format" },
    { id: "resize", label: "Resize" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm w-fit mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(null); setError(null); }}
            className={`px-5 py-2.5 font-medium transition-colors ${
              tab === t.id ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Upload zone */}
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">Drop image here or click to browse</p>
          <p className="text-sm text-gray-400">JPEG, PNG, WebP, GIF · Max 50 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && loadImage(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preview + info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl flex-shrink-0 border border-gray-100" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate text-sm">{image.file.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatBytes(image.originalSize)}
                {naturalSize && ` · ${naturalSize.w} × ${naturalSize.h}px`}
              </p>
            </div>
            <button onClick={reset} className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
            {tab === "compress" && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">Quality</label>
                  <span className="text-sm font-semibold text-blue-600">{quality}%</span>
                </div>
                <input
                  type="range" min={10} max={100} step={5}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Smallest file</span>
                  <span>Best quality</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">Output format: JPEG (best compression). For PNG transparency, use Convert tab.</p>
              </div>
            )}

            {tab === "convert" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                  <div className="flex gap-2">
                    {(["jpeg", "webp", "png"] as OutputFormat[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setOutputFormat(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          outputFormat === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {outputFormat !== "png" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Quality</label>
                      <span className="text-sm font-semibold text-blue-600">{quality}%</span>
                    </div>
                    <input
                      type="range" min={10} max={100} step={5}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}
                {outputFormat === "webp" && (
                  <p className="text-xs text-gray-500">WebP offers 25–35% better compression than JPEG at the same quality.</p>
                )}
                {outputFormat === "png" && (
                  <p className="text-xs text-gray-500">PNG is lossless and supports transparency. File size may be larger than JPEG/WebP.</p>
                )}
              </div>
            )}

            {tab === "resize" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Width (px)</label>
                    <input
                      type="number" min={1} max={8000}
                      value={resizeWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Height (px)</label>
                    <input
                      type="number" min={1} max={8000}
                      value={resizeHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Maintain aspect ratio</span>
                </label>
                {naturalSize && (
                  <p className="text-xs text-gray-500">Original: {naturalSize.w} × {naturalSize.h}px</p>
                )}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          {/* Action button */}
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
              tab === "compress" ? "Compress Image" : tab === "convert" ? "Convert Image" : "Resize Image"
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-800 text-sm">Done!</p>
                  <p className="text-sm text-green-700 mt-0.5">
                    {formatBytes(result.size)}
                    {tab !== "convert" && image && (
                      <span className="ml-2 text-green-600 font-medium">({getSaving(image.originalSize, result.size)})</span>
                    )}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5 truncate">{result.filename}</p>
                </div>
                <button
                  onClick={download}
                  className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
