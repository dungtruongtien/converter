"use client";

import { useState } from "react";

interface Stats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  uniqueWords: number;
}

function analyze(text: string): Stats {
  if (!text.trim()) {
    return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: "0 sec", uniqueWords: 0 };
  }
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[^.!?]*[.!?]+/g) ?? []).length || (text.trim() ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
  const wpm = 200;
  const mins = words.length / wpm;
  const readingTime = mins < 1 ? `${Math.ceil(mins * 60)} sec` : `${Math.ceil(mins)} min`;
  const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean)).size;
  return { words: words.length, chars, charsNoSpaces, sentences, paragraphs, readingTime, uniqueWords };
}

export function WordCounterClient() {
  const [text, setText] = useState("");
  const stats = analyze(text);

  const statItems = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Chars (no spaces)", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Unique words", value: stats.uniqueWords },
    { label: "Reading time", value: stats.readingTime },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste or type your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-52 rounded-xl border border-gray-200 p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Start typing or paste your text here…"
        />
        <p className="mt-1 text-xs text-gray-400">{text.length.toLocaleString()} characters typed</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statItems.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{typeof value === "number" ? value.toLocaleString() : value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {text && (
        <button
          onClick={() => setText("")}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors underline"
        >
          Clear text
        </button>
      )}
    </div>
  );
}
