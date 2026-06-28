"use client";

import { useState } from "react";

type Mode = "pct-of" | "what-pct" | "pct-change" | "add-pct" | "subtract-pct";

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "pct-of",       label: "% of a number",     desc: "What is X% of Y?" },
  { id: "what-pct",     label: "What % is X of Y?", desc: "X is what % of Y?" },
  { id: "pct-change",   label: "% change",          desc: "Change from X to Y" },
  { id: "add-pct",      label: "Add %",             desc: "X plus Y%" },
  { id: "subtract-pct", label: "Subtract %",        desc: "X minus Y%" },
];

function fmt(n: number) {
  if (!isFinite(n)) return "∞";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(3).replace(/\.?0+$/, "") + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(3).replace(/\.?0+$/, "") + "M";
  const str = n.toPrecision(10).replace(/\.?0+$/, "");
  return parseFloat(str).toLocaleString("en-US", { maximumFractionDigits: 8 });
}

function calc(mode: Mode, a: number, b: number): { result: string; explain: string } | null {
  if (isNaN(a) || isNaN(b)) return null;
  switch (mode) {
    case "pct-of": {
      const r = (a / 100) * b;
      return { result: fmt(r), explain: `${fmt(a)}% of ${fmt(b)} = ${fmt(r)}` };
    }
    case "what-pct": {
      if (b === 0) return { result: "∞", explain: "Cannot divide by zero" };
      const r = (a / b) * 100;
      return { result: fmt(r) + "%", explain: `${fmt(a)} is ${fmt(r)}% of ${fmt(b)}` };
    }
    case "pct-change": {
      if (a === 0) return { result: "∞", explain: "Cannot calculate % change from 0" };
      const r = ((b - a) / Math.abs(a)) * 100;
      const dir = r >= 0 ? "increase" : "decrease";
      return { result: fmt(Math.abs(r)) + "%", explain: `${r > 0 ? "+" : ""}${fmt(r)}% ${dir} from ${fmt(a)} to ${fmt(b)}` };
    }
    case "add-pct": {
      const r = a * (1 + b / 100);
      return { result: fmt(r), explain: `${fmt(a)} + ${fmt(b)}% = ${fmt(r)} (added ${fmt(a * b / 100)})` };
    }
    case "subtract-pct": {
      const r = a * (1 - b / 100);
      return { result: fmt(r), explain: `${fmt(a)} − ${fmt(b)}% = ${fmt(r)} (removed ${fmt(a * b / 100)})` };
    }
    default: return null;
  }
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "0"}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default function PercentageCalculatorClient() {
  const [mode, setMode] = useState<Mode>("pct-of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [copied, setCopied] = useState(false);

  const result = calc(mode, parseFloat(a), parseFloat(b));

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const labels: Record<Mode, [string, string]> = {
    "pct-of":       ["Percentage (%)", "of Number"],
    "what-pct":     ["Number (X)", "of Number (Y)"],
    "pct-change":   ["From", "To"],
    "add-pct":      ["Number", "Add % (%)"],
    "subtract-pct": ["Number", "Subtract % (%)"],
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Mode selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setA(""); setB(""); }}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium text-left transition-all ${
              mode === m.id
                ? "bg-green-600 text-white border-green-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
            }`}
          >
            <div className="font-semibold text-xs mb-0.5">{m.label}</div>
            <div className={`text-xs ${mode === m.id ? "text-green-100" : "text-gray-400"}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label={labels[mode][0]} value={a} onChange={setA} />
          <Field label={labels[mode][1]} value={b} onChange={setB} />
        </div>

        {/* Result */}
        {result ? (
          <div className="bg-green-50 rounded-xl border border-green-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-green-600 font-medium mb-0.5">Result</p>
                <p className="text-3xl font-bold text-green-800 leading-none">{result.result}</p>
                <p className="text-sm text-green-700 mt-2">{result.explain}</p>
              </div>
              <button
                onClick={copy}
                className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center text-gray-400 text-sm">
            Enter values above to see the result
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div className="text-xs text-gray-400 text-center space-y-0.5">
        <p>All calculations happen instantly in your browser — nothing is sent to any server.</p>
      </div>
    </div>
  );
}
