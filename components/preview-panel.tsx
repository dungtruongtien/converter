"use client";

import { useState } from "react";

interface PreviewPanelProps {
  content: string;
  filename: string;
  downloadUrl: string;
  type: "html" | "pdf";
}

export function PreviewPanel({ content, filename, downloadUrl, type }: PreviewPanelProps) {
  const [view, setView] = useState<"code" | "preview">("code");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-1">
          {type === "html" && (
            <>
              <button
                onClick={() => setView("code")}
                className={["px-3 py-1 rounded text-sm font-medium", view === "code" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"].join(" ")}
              >
                Code
              </button>
              <button
                onClick={() => setView("preview")}
                className={["px-3 py-1 rounded text-sm font-medium", view === "preview" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"].join(" ")}
              >
                Preview
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {type === "html" && (
            <button
              onClick={copyToClipboard}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          )}
          <a
            href={downloadUrl}
            download={filename}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ↓ Download
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === "code" || type === "pdf" ? (
          <pre className="p-4 text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
            <code>{content.slice(0, 8000)}{content.length > 8000 ? "\n\n… (truncated for display)" : ""}</code>
          </pre>
        ) : (
          <iframe
            srcDoc={content}
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
            title="HTML Preview"
          />
        )}
      </div>
    </div>
  );
}
