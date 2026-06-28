"use client";

import { useState, useCallback } from "react";

type Mode = "list" | "number" | "coin" | "dice" | "cards";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RandomPickerClient() {
  const [mode, setMode] = useState<Mode>("list");
  const [listInput, setListInput] = useState("Alice\nBob\nCharlie\nDiana\nEve");
  const [pickCount, setPickCount] = useState("1");
  const [numMin, setNumMin] = useState("1");
  const [numMax, setNumMax] = useState("100");
  const [numCount, setNumCount] = useState("1");
  const [allowDupes, setAllowDupes] = useState(false);
  const [diceCount, setDiceCount] = useState("2");
  const [cardCount, setCardCount] = useState("5");
  const [result, setResult] = useState<string[] | null>(null);
  const [history, setHistory] = useState<{ label: string; values: string[] }[]>([]);
  const [animating, setAnimating] = useState(false);

  const push = useCallback((label: string, values: string[]) => {
    setHistory((h) => [{ label, values }, ...h].slice(0, 10));
  }, []);

  const pick = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      let picked: string[] = [];
      try {
        if (mode === "list") {
          const items = listInput.split("\n").map((s) => s.trim()).filter(Boolean);
          if (items.length === 0) return;
          const n = Math.min(Math.max(1, parseInt(pickCount) || 1), items.length);
          if (allowDupes) {
            picked = Array.from({ length: n }, () => items[Math.floor(Math.random() * items.length)]);
          } else {
            picked = shuffle(items).slice(0, n);
          }
          push(`Pick ${n} from list`, picked);

        } else if (mode === "number") {
          const min = parseInt(numMin);
          const max = parseInt(numMax);
          const n = Math.max(1, parseInt(numCount) || 1);
          if (isNaN(min) || isNaN(max) || min > max) { picked = ["Invalid range"]; }
          else if (!allowDupes && n > max - min + 1) { picked = ["Range too small for unique picks"]; }
          else {
            if (allowDupes) {
              picked = Array.from({ length: n }, () => String(Math.floor(Math.random() * (max - min + 1)) + min));
            } else {
              const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min);
              picked = shuffle(pool).slice(0, n).map(String);
            }
          }
          push(`${n} random number${n > 1 ? "s" : ""} (${min}–${max})`, picked);

        } else if (mode === "coin") {
          const r = Math.random() < 0.5 ? "Heads" : "Tails";
          picked = [r];
          push("Coin flip", picked);

        } else if (mode === "dice") {
          const n = Math.max(1, Math.min(10, parseInt(diceCount) || 1));
          picked = Array.from({ length: n }, () => {
            const face = Math.floor(Math.random() * 6);
            return `${DICE_FACES[face]} (${face + 1})`;
          });
          const total = picked.reduce((s, d) => s + parseInt(d.match(/\((\d+)\)/)![1]), 0);
          if (n > 1) picked.push(`Total: ${total}`);
          push(`Roll ${n}d6`, picked);

        } else if (mode === "cards") {
          const n = Math.max(1, Math.min(52, parseInt(cardCount) || 5));
          const deck = SUITS.flatMap((s) => RANKS.map((r) => `${r}${s}`));
          picked = shuffle(deck).slice(0, n);
          push(`Draw ${n} card${n > 1 ? "s" : ""}`, picked);
        }
      } finally {
        setResult(picked);
        setAnimating(false);
      }
    }, 120);
  }, [mode, listInput, pickCount, numMin, numMax, numCount, allowDupes, diceCount, cardCount, push]);

  const MODES: { id: Mode; label: string; emoji: string }[] = [
    { id: "list",   label: "From List",   emoji: "📋" },
    { id: "number", label: "Numbers",     emoji: "🔢" },
    { id: "coin",   label: "Coin Flip",   emoji: "🪙" },
    { id: "dice",   label: "Dice Roll",   emoji: "🎲" },
    { id: "cards",  label: "Card Draw",   emoji: "🃏" },
  ];

  const isRedCard = (s: string) => s.endsWith("♥") || s.endsWith("♦");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setResult(null); }}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
              mode === m.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
            }`}
          >
            <span>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        {mode === "list" && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Items — one per line</label>
              <textarea
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">How many to pick</label>
                <input
                  type="number" min={1} value={pickCount}
                  onChange={(e) => setPickCount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <label className="flex items-center gap-2 pb-2.5 cursor-pointer">
                <input type="checkbox" checked={allowDupes} onChange={(e) => setAllowDupes(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
                <span className="text-sm text-gray-700">Allow duplicates</span>
              </label>
            </div>
          </>
        )}

        {mode === "number" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[["Min", numMin, setNumMin], ["Max", numMax, setNumMax], ["Count", numCount, setNumCount]].map(([lbl, val, set]) => (
                <div key={lbl as string}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{lbl as string}</label>
                  <input
                    type="number" value={val as string}
                    onChange={(e) => (set as (v: string) => void)(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={allowDupes} onChange={(e) => setAllowDupes(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
              <span className="text-sm text-gray-700">Allow duplicates</span>
            </label>
          </>
        )}

        {mode === "dice" && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Number of dice (1–10)</label>
            <input
              type="number" min={1} max={10} value={diceCount}
              onChange={(e) => setDiceCount(e.target.value)}
              className="w-32 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {mode === "cards" && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Cards to draw (1–52)</label>
            <input
              type="number" min={1} max={52} value={cardCount}
              onChange={(e) => setCardCount(e.target.value)}
              className="w-32 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {mode === "coin" && (
          <p className="text-sm text-gray-500">50/50 chance. Click to flip.</p>
        )}

        <button
          onClick={pick}
          disabled={animating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-base"
        >
          {animating ? "Picking…" : mode === "coin" ? "Flip!" : mode === "dice" ? "Roll!" : mode === "cards" ? "Draw!" : "Pick!"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl border p-5 transition-all ${animating ? "opacity-0" : "opacity-100"} ${
          mode === "coin"
            ? result[0] === "Heads" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
            : "bg-indigo-50 border-indigo-200"
        }`}>
          {mode === "coin" && (
            <div className="text-center">
              <p className="text-6xl mb-2">{result[0] === "Heads" ? "🪙" : "🔘"}</p>
              <p className="text-2xl font-bold text-gray-800">{result[0]}</p>
            </div>
          )}
          {mode === "cards" && (
            <div className="flex flex-wrap gap-2 justify-center">
              {result.map((card, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center justify-center w-12 h-16 rounded-lg border-2 bg-white text-lg font-bold shadow-sm ${
                    isRedCard(card) ? "text-red-600 border-red-200" : "text-gray-800 border-gray-200"
                  }`}
                >
                  {card}
                </span>
              ))}
            </div>
          )}
          {mode !== "coin" && mode !== "cards" && (
            <div>
              {result.length === 1 ? (
                <div className="text-center">
                  <p className="text-xs font-medium text-indigo-500 mb-1">Result</p>
                  <p className="text-3xl font-bold text-indigo-800">{result[0]}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-indigo-600">{result.length} results</p>
                  <div className="flex flex-wrap gap-2">
                    {result.map((r, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                        r.startsWith("Total:") ? "bg-indigo-200 text-indigo-900" : "bg-white border border-indigo-100 text-indigo-800"
                      }`}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500">Recent picks</p>
            <button onClick={() => setHistory([])} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          <div className="space-y-1">
            {history.map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-xs bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-400 flex-shrink-0 mt-0.5">{i + 1}.</span>
                <div>
                  <span className="text-gray-500">{h.label}: </span>
                  <span className="text-gray-800 font-medium">{h.values.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
