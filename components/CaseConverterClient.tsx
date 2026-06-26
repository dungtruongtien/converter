"use client";

import { useState } from "react";

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "constant";

const CASES: { id: CaseType; label: string }[] = [
  { id: "upper", label: "UPPER CASE" },
  { id: "lower", label: "lower case" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "constant", label: "CONSTANT_CASE" },
];

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function convert(text: string, type: CaseType): string {
  if (!text.trim()) return "";
  const words = toWords(text);
  switch (type) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "title": return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    case "sentence": {
      const lower = text.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    case "camel": return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "pascal": return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    case "snake": return words.map((w) => w.toLowerCase()).join("_");
    case "kebab": return words.map((w) => w.toLowerCase()).join("-");
    case "constant": return words.map((w) => w.toUpperCase()).join("_");
  }
}

export function CaseConverterClient() {
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("title");
  const [copied, setCopied] = useState(false);

  const output = convert(input, activeCase);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Input text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-36 rounded-xl border border-gray-200 p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type or paste text to convert…"
        />
      </div>

      {/* Case buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Choose case</p>
        <div className="flex flex-wrap gap-2">
          {CASES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCase(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                activeCase === id
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Output</label>
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
            <p className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{output}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">Output will appear here…</p>
          )}
        </div>
      </div>

      {/* Quick all-cases preview */}
      {input.trim() && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">All conversions</p>
          <div className="rounded-xl border border-gray-100 bg-white divide-y divide-gray-100">
            {CASES.map(({ id, label }) => (
              <div key={id} className="flex items-center justify-between px-4 py-2.5 gap-4">
                <span className="text-xs text-gray-400 w-28 shrink-0">{label}</span>
                <span className="text-sm font-mono text-gray-800 flex-1 truncate">{convert(input, id)}</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(convert(input, id));
                  }}
                  className="text-xs text-gray-400 hover:text-green-600 transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
