"use client";

import { useState, useEffect } from "react";

type InputMode = "unix" | "iso" | "now";

function pad(n: number) { return String(n).padStart(2, "0"); }

function formatUtc(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

function formatLocal(d: Date): string {
  return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
}

function formatRelative(d: Date): string {
  const diff = Math.round((Date.now() - d.getTime()) / 1000);
  if (Math.abs(diff) < 60) return `${Math.abs(diff)} seconds ${diff >= 0 ? "ago" : "from now"}`;
  if (Math.abs(diff) < 3600) return `${Math.round(Math.abs(diff)/60)} minutes ${diff >= 0 ? "ago" : "from now"}`;
  if (Math.abs(diff) < 86400) return `${Math.round(Math.abs(diff)/3600)} hours ${diff >= 0 ? "ago" : "from now"}`;
  return `${Math.round(Math.abs(diff)/86400)} days ${diff >= 0 ? "ago" : "from now"}`;
}

export function TimestampConverterClient() {
  const [mode, setMode] = useState<InputMode>("now");
  const [rawInput, setRawInput] = useState("");
  const [now, setNow] = useState(new Date());
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "now") return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [mode]);

  const date = (() => {
    if (mode === "now") return now;
    if (!rawInput.trim()) return null;
    if (mode === "unix") {
      const n = Number(rawInput.trim());
      if (isNaN(n)) return null;
      // Auto-detect ms vs seconds: use absolute value for threshold check
      const ms = Math.abs(n) > 1e12 ? n : n * 1000;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    if (mode === "iso") {
      const d = new Date(rawInput.trim());
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  })();

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const results = date
    ? [
        { label: "Unix timestamp (seconds)", value: String(Math.floor(date.getTime() / 1000)) },
        { label: "Unix timestamp (ms)", value: String(date.getTime()) },
        { label: "UTC", value: formatUtc(date) },
        { label: "Local time", value: formatLocal(date) },
        { label: "ISO 8601", value: date.toISOString() },
        { label: "Relative", value: formatRelative(date) },
        { label: "Day of week", value: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getUTCDay()] },
      ]
    : [];

  const isInvalid = rawInput.trim() && !date;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Mode tabs */}
      <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm w-fit">
        {([["now", "Current time"], ["unix", "Unix → Date"], ["iso", "Date → Unix"]] as const).map(([m, label]) => (
          <button
            key={m}
            onClick={() => { setMode(m as InputMode); setRawInput(""); }}
            className={`px-5 py-2.5 font-medium transition-colors ${
              mode === m ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode !== "now" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === "unix" ? "Unix timestamp (seconds or ms)" : "Date / ISO string"}
          </label>
          <input
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={mode === "unix" ? "e.g. 1700000000 or 1700000000000" : "e.g. 2024-01-15T12:00:00Z or Jan 15 2024"}
          />
          {isInvalid && (
            <p className="mt-1.5 text-xs text-red-600">Could not parse this value. Try a Unix timestamp or ISO date string.</p>
          )}
        </div>
      )}

      {mode === "now" && (
        <div className="text-center py-2">
          <p className="text-5xl font-mono font-bold text-gray-900">{pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}</p>
          <p className="text-sm text-gray-500 mt-2">{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white divide-y divide-gray-100">
          {results.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-xs text-gray-400 w-44 shrink-0">{label}</span>
              <span className="text-sm font-mono text-gray-800 flex-1 truncate">{value}</span>
              <button
                onClick={() => copy(value, label)}
                className="text-xs text-gray-400 hover:text-green-600 transition-colors shrink-0"
              >
                {copied === label ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
