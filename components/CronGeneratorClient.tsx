"use client";

import { useState } from "react";

interface CronFields {
  minute: string;
  hour: string;
  day: string;
  month: string;
  weekday: string;
}

const PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every day at noon", cron: "0 12 * * *" },
  { label: "Every Sunday midnight", cron: "0 0 * * 0" },
  { label: "Every Monday 9 AM", cron: "0 9 * * 1" },
  { label: "Weekdays 9–5 (hourly)", cron: "0 9-17 * * 1-5" },
  { label: "1st of every month", cron: "0 0 1 * *" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
  { label: "Every 6 hours", cron: "0 */6 * * *" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function fmtWdayToken(token: string): string {
  if (token.includes("-")) {
    const [a, b] = token.split("-");
    const dayA = WEEKDAYS[parseInt(a)] ?? a;
    const dayB = WEEKDAYS[parseInt(b)] ?? b;
    return `${dayA}–${dayB}`;
  }
  return WEEKDAYS[parseInt(token)] ?? token;
}

function describe(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (needs 5 fields)";
  const [min, hr, day, mon, wday] = parts;

  // Short-circuit canonical descriptions first
  if (min === "*" && hr === "*" && day === "*" && mon === "*" && wday === "*")
    return "Every minute";
  if (min === "0" && hr === "*" && day === "*" && mon === "*" && wday === "*")
    return "Every hour, at the top of the hour";
  if (min.startsWith("*/") && hr === "*" && day === "*" && mon === "*" && wday === "*")
    return `Every ${min.slice(2)} minutes`;
  if (min === "0" && hr.startsWith("*/") && day === "*" && mon === "*" && wday === "*")
    return `Every ${hr.slice(2)} hours`;

  const fmtMin = min === "*" ? "every minute" : min.startsWith("*/") ? `every ${min.slice(2)} minutes` : `at minute ${min}`;
  const fmtHr  = hr === "*"  ? "every hour"  : hr.startsWith("*/")  ? `every ${hr.slice(2)} hours`   :
    hr.includes("-") ? `between ${hr.split("-").map((h) => `${h}:00`).join(" and ")}` : `at ${hr}:00`;
  const fmtDay = day === "*" ? "every day" : `on day ${day} of the month`;
  const fmtMon = mon === "*" ? "" : ` in ${mon.split(",").map((m) => MONTHS[parseInt(m) - 1] ?? m).join(", ")}`;
  const fmtWday = wday === "*" ? "" : ` on ${wday.split(",").map(fmtWdayToken).join(", ")}`;

  return `Runs ${fmtMin}, ${fmtHr}, ${fmtDay}${fmtMon}${fmtWday}`.trim();
}

function parseCron(cron: string): CronFields {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return { minute: "*", hour: "*", day: "*", month: "*", weekday: "*" };
  return { minute: parts[0], hour: parts[1], day: parts[2], month: parts[3], weekday: parts[4] };
}

export function CronGeneratorClient() {
  const [expr, setExpr] = useState("* * * * *");
  const [fields, setFields] = useState<CronFields>(parseCron("* * * * *"));
  const [copied, setCopied] = useState(false);

  const updateFromFields = (updated: CronFields) => {
    setFields(updated);
    setExpr(`${updated.minute} ${updated.hour} ${updated.day} ${updated.month} ${updated.weekday}`);
  };

  const updateFromExpr = (raw: string) => {
    setExpr(raw);
    setFields(parseCron(raw));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(expr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const description = describe(expr);
  const isValid = expr.trim().split(/\s+/).length === 5;

  const fieldDefs: { key: keyof CronFields; label: string; placeholder: string }[] = [
    { key: "minute", label: "Minute", placeholder: "0-59 or *" },
    { key: "hour", label: "Hour", placeholder: "0-23 or *" },
    { key: "day", label: "Day", placeholder: "1-31 or *" },
    { key: "month", label: "Month", placeholder: "1-12 or *" },
    { key: "weekday", label: "Weekday", placeholder: "0-6 or *" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Expression input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cron expression</label>
        <div className="flex gap-3 items-center">
          <input
            value={expr}
            onChange={(e) => updateFromExpr(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="* * * * *"
          />
          <button
            onClick={copy}
            className="text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className={`mt-2 text-sm px-1 ${isValid ? "text-green-700" : "text-red-600"}`}>
          {isValid ? `▸ ${description}` : "⚠ Invalid — needs exactly 5 space-separated fields"}
        </div>
        <p className="mt-1 text-xs text-gray-400">Format: minute · hour · day · month · weekday</p>
      </div>

      {/* Visual field builder */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Visual builder</p>
        <div className="grid grid-cols-5 gap-2">
          {fieldDefs.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1 text-center">{label}</label>
              <input
                value={fields[key]}
                onChange={(e) => updateFromFields({ ...fields, [key]: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-2 py-2 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Common presets</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PRESETS.map(({ label, cron }) => (
            <button
              key={cron}
              onClick={() => updateFromExpr(cron)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left transition-all ${
                expr === cron
                  ? "border-green-400 bg-green-50 text-green-800"
                  : "border-gray-100 bg-white hover:border-green-300 text-gray-700"
              }`}
            >
              <span className="font-medium">{label}</span>
              <span className="font-mono text-xs text-gray-400">{cron}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
