"use client";

import { useState } from "react";

export function CharacterCounterClient() {
  const [text, setText] = useState("");

  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const letters = (text.match(/[a-zA-Z]/g) ?? []).length;
  const digits = (text.match(/[0-9]/g) ?? []).length;
  const spaces = (text.match(/\s/g) ?? []).length;
  const special = chars - letters - digits - spaces;
  const lines = text === "" ? 0 : text.split("\n").length;

  const stats = [
    { label: "Characters (with spaces)", value: chars },
    { label: "Characters (no spaces)", value: charsNoSpaces },
    { label: "Letters", value: letters },
    { label: "Digits", value: digits },
    { label: "Spaces", value: spaces },
    { label: "Special characters", value: Math.max(0, special) },
    { label: "Lines", value: lines },
  ];

  // Twitter / SMS limits
  const limits = [
    { platform: "Twitter / X", limit: 280, color: "bg-gray-900" },
    { platform: "SMS", limit: 160, color: "bg-green-600" },
    { platform: "Meta description", limit: 160, color: "bg-blue-600" },
    { platform: "Page title", limit: 60, color: "bg-purple-600" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-44 rounded-xl border border-gray-200 p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type or paste text here to count characters…"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Platform limits */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Platform character limits</h2>
        <div className="space-y-3">
          {limits.map(({ platform, limit, color }) => {
            const pct = Math.min((chars / limit) * 100, 100);
            const over = chars > limit;
            return (
              <div key={platform}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{platform}</span>
                  <span className={over ? "text-red-600 font-semibold" : ""}>
                    {chars} / {limit} {over ? `(+${chars - limit} over)` : ""}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-red-500" : color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {text && (
        <button onClick={() => setText("")} className="text-sm text-gray-500 hover:text-red-600 transition-colors underline">
          Clear
        </button>
      )}
    </div>
  );
}
