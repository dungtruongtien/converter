"use client";

import { useState, useMemo } from "react";

type Mode = "encode" | "decode";

function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(text: string): string {
  return decodeURIComponent(escape(atob(text.trim())));
}

export function Base64Client() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      return {
        output: mode === "encode" ? encodeBase64(input) : decodeBase64(input),
        error: null,
      };
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Error",
      };
    }
  }, [input, mode]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      {/* Mode toggle */}
      <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm w-fit">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2.5 font-medium transition-colors ${
              mode === m ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {m === "encode" ? "Encode →" : "← Decode"}
          </button>
        ))}
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === "encode" ? "Plain text" : "Base64 string"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 rounded-xl border border-gray-200 p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={mode === "encode" ? "Enter text to encode…" : "Enter Base64 to decode…"}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            {mode === "encode" ? "Base64 output" : "Decoded text"}
          </label>
          <div className="flex gap-2">
            <button
              onClick={swap}
              disabled={!output}
              className="text-xs text-gray-500 hover:text-green-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
            >
              ⇄ Swap
            </button>
            <button
              onClick={copy}
              disabled={!output}
              className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="min-h-[100px] rounded-xl border border-gray-200 bg-gray-50 p-4">
          {output ? (
            <p className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">{output}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              {error ? "Fix the error above to see output." : "Output will appear here…"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
