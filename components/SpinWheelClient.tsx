"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const DEFAULT_ITEMS = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6"];

const PALETTE = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444",
  "#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#14b8a6", "#e11d48",
];

function polarToXY(angle: number, r: number, cx: number, cy: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function buildSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToXY(startAngle, r, cx, cy);
  const end = polarToXY(endAngle, r, cx, cy);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

export default function SpinWheelClient() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [editText, setEditText] = useState(DEFAULT_ITEMS.join("\n"));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const startRotRef = useRef<number>(0);
  const targetRotRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const SIZE = 300;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE / 2 - 4;

  const validItems = items.filter((s) => s.trim().length > 0);

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

  const spin = useCallback(() => {
    if (spinning || validItems.length < 2) return;
    setWinner(null);
    setSpinning(true);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.random() * 360;
    const target = startRotRef.current + extraSpins * 360 + randomAngle;
    targetRotRef.current = target;
    startRotRef.current = rotation;
    startTimeRef.current = performance.now();
    durationRef.current = 3500 + Math.random() * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / durationRef.current, 1);
      const eased = easeOut(t);
      const current = startRotRef.current + (targetRotRef.current - startRotRef.current) * eased;
      setRotation(current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(targetRotRef.current);
        startRotRef.current = targetRotRef.current;
        setSpinning(false);

        // Pointer is at top (270° in standard math = -90° offset)
        // Wheel rotates, so we need to find which slice is at the top
        const normalised = ((targetRotRef.current % 360) + 360) % 360;
        const pointerAngle = (270 - normalised + 360) % 360;
        const sliceAngle = 360 / validItems.length;
        const idx = Math.floor(pointerAngle / sliceAngle) % validItems.length;
        setWinner(validItems[idx]);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [spinning, validItems, rotation]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const applyEdit = () => {
    const parsed = editText.split("\n").map((s) => s.trim()).filter(Boolean);
    if (parsed.length >= 2) {
      setItems(parsed);
      setWinner(null);
      setRotation(0);
      startRotRef.current = 0;
    }
    setShowEdit(false);
  };

  const sliceAngle = (2 * Math.PI) / Math.max(validItems.length, 1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-6">
        {/* Wheel */}
        <div className="relative select-none">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 flex flex-col items-center">
            <div className="w-5 h-6 bg-gray-900 clip-triangle" style={{ clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)" }} />
          </div>

          <svg
            width={SIZE}
            height={SIZE}
            style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "none" : "transform 0.1s" }}
          >
            {validItems.map((item, i) => {
              const start = i * sliceAngle - Math.PI / 2;
              const end = start + sliceAngle;
              const mid = (start + end) / 2;
              const textR = r * 0.62;
              const tx = cx + textR * Math.cos(mid);
              const ty = cy + textR * Math.sin(mid);
              const maxChars = validItems.length <= 4 ? 16 : validItems.length <= 6 ? 12 : 8;
              const label = item.length > maxChars ? item.slice(0, maxChars - 1) + "…" : item;
              return (
                <g key={i}>
                  <path
                    d={buildSlicePath(cx, cy, r, start, end)}
                    fill={PALETTE[i % PALETTE.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={validItems.length <= 4 ? 14 : validItems.length <= 8 ? 12 : 10}
                    fontWeight="600"
                    transform={`rotate(${(mid * 180) / Math.PI + 90}, ${tx}, ${ty})`}
                    style={{ pointerEvents: "none" }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
            {/* Center cap */}
            <circle cx={cx} cy={cy} r={18} fill="white" stroke="#e5e7eb" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={8} fill="#6366f1" />
          </svg>
        </div>

        {/* Winner banner */}
        {winner && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-6 py-3 text-center">
            <p className="text-xs text-indigo-500 font-medium mb-0.5">Winner!</p>
            <p className="text-xl font-bold text-indigo-800">{winner}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={spin}
            disabled={spinning || validItems.length < 2}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl text-base transition-colors shadow-sm"
          >
            {spinning ? "Spinning…" : "Spin!"}
          </button>
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-4 py-3 rounded-xl text-sm transition-colors"
          >
            Edit options
          </button>
        </div>

        {/* Edit panel */}
        {showEdit && (
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Options — one per line (min 2, max 20)</p>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
            {editText.split("\n").filter((s) => s.trim()).length < 2 && (
              <p className="text-xs text-red-500">Enter at least 2 options.</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={applyEdit}
                disabled={editText.split("\n").filter((s) => s.trim()).length < 2}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Current items */}
        {!showEdit && (
          <div className="w-full">
            <p className="text-xs text-gray-400 text-center mb-2">{validItems.length} options on the wheel</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {validItems.map((item, i) => (
                <span
                  key={i}
                  className="text-xs text-white font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
