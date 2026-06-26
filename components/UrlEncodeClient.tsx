"use client";

import { useState, useMemo } from "react";

type Mode = "encode" | "decode";

export function UrlEncodeClient() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      return {
        output: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
        error: null,
      };
    } catch {
      return {
        output: "",
        error: "Invalid percent-encoded string. Check your input for incomplete sequences.",
      };
    }
  }, [input, mode]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
          {mode === "encode" ? "Raw text / URL" : "Percent-encoded string"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-36 rounded-xl border border-gray-200 p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={
            mode === "encode"
              ? "e.g. hello world & more=yes"
              : "e.g. hello%20world%20%26%20more%3Dyes"
          }
        />
        <p className="mt-1 text-xs text-gray-400">
          {mode === "encode" ? "Uses encodeURIComponent — encodes all special characters" : "Uses decodeURIComponent"}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">{error}</p>
      )}

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            {mode === "encode" ? "Encoded output" : "Decoded text"}
          </label>
          <button
            onClick={copy}
            disabled={!output}
            className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="min-h-[80px] rounded-xl border border-gray-200 bg-gray-50 p-4">
          {output ? (
            <p className="text-sm font-mono text-gray-800 break-all whitespace-pre-wrap">{output}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              {error ? "Fix the error above." : "Output will appear here…"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
