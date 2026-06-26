"use client";

import { useState } from "react";

type Category = "length" | "weight" | "temperature" | "speed" | "area" | "volume";

interface Unit { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number; }
interface CategoryDef { label: string; units: Unit[]; }

const CATEGORIES: Record<Category, CategoryDef> = {
  length: {
    label: "Length",
    units: [
      { id: "mm",    label: "Millimeters (mm)",   toBase: v => v / 1000,      fromBase: v => v * 1000 },
      { id: "cm",    label: "Centimeters (cm)",   toBase: v => v / 100,       fromBase: v => v * 100 },
      { id: "m",     label: "Meters (m)",          toBase: v => v,             fromBase: v => v },
      { id: "km",    label: "Kilometers (km)",     toBase: v => v * 1000,      fromBase: v => v / 1000 },
      { id: "in",    label: "Inches (in)",         toBase: v => v * 0.0254,    fromBase: v => v / 0.0254 },
      { id: "ft",    label: "Feet (ft)",           toBase: v => v * 0.3048,    fromBase: v => v / 0.3048 },
      { id: "yd",    label: "Yards (yd)",          toBase: v => v * 0.9144,    fromBase: v => v / 0.9144 },
      { id: "mi",    label: "Miles (mi)",          toBase: v => v * 1609.344,  fromBase: v => v / 1609.344 },
    ],
  },
  weight: {
    label: "Weight / Mass",
    units: [
      { id: "mg",    label: "Milligrams (mg)",     toBase: v => v / 1e6,       fromBase: v => v * 1e6 },
      { id: "g",     label: "Grams (g)",           toBase: v => v / 1000,      fromBase: v => v * 1000 },
      { id: "kg",    label: "Kilograms (kg)",      toBase: v => v,             fromBase: v => v },
      { id: "t",     label: "Tonnes (t)",          toBase: v => v * 1000,      fromBase: v => v / 1000 },
      { id: "oz",    label: "Ounces (oz)",         toBase: v => v * 0.028349,  fromBase: v => v / 0.028349 },
      { id: "lb",    label: "Pounds (lb)",         toBase: v => v * 0.453592,  fromBase: v => v / 0.453592 },
      { id: "st",    label: "Stone (st)",          toBase: v => v * 6.350293,  fromBase: v => v / 6.350293 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { id: "c",  label: "Celsius (°C)",    toBase: v => v,               fromBase: v => v },
      { id: "f",  label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5/9,  fromBase: v => v * 9/5 + 32 },
      { id: "k",  label: "Kelvin (K)",      toBase: v => v - 273.15,      fromBase: v => v + 273.15 },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { id: "ms",   label: "Meters/sec (m/s)",   toBase: v => v,             fromBase: v => v },
      { id: "kmh",  label: "Km/hour (km/h)",      toBase: v => v / 3.6,      fromBase: v => v * 3.6 },
      { id: "mph",  label: "Miles/hour (mph)",    toBase: v => v * 0.44704,  fromBase: v => v / 0.44704 },
      { id: "kn",   label: "Knots (kn)",          toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ],
  },
  area: {
    label: "Area",
    units: [
      { id: "m2",   label: "Square meters (m²)",  toBase: v => v,             fromBase: v => v },
      { id: "km2",  label: "Square km (km²)",     toBase: v => v * 1e6,       fromBase: v => v / 1e6 },
      { id: "ft2",  label: "Square feet (ft²)",   toBase: v => v * 0.092903,  fromBase: v => v / 0.092903 },
      { id: "ac",   label: "Acres (ac)",           toBase: v => v * 4046.856, fromBase: v => v / 4046.856 },
      { id: "ha",   label: "Hectares (ha)",        toBase: v => v * 10000,    fromBase: v => v / 10000 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { id: "ml",   label: "Milliliters (ml)",    toBase: v => v / 1000,      fromBase: v => v * 1000 },
      { id: "l",    label: "Liters (L)",           toBase: v => v,             fromBase: v => v },
      { id: "m3",   label: "Cubic meters (m³)",   toBase: v => v * 1000,      fromBase: v => v / 1000 },
      { id: "tsp",  label: "Teaspoon (tsp)",       toBase: v => v * 0.004929, fromBase: v => v / 0.004929 },
      { id: "tbsp", label: "Tablespoon (tbsp)",    toBase: v => v * 0.014787, fromBase: v => v / 0.014787 },
      { id: "floz", label: "Fl. oz (fl oz)",       toBase: v => v * 0.029574, fromBase: v => v / 0.029574 },
      { id: "cup",  label: "Cup (US)",             toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      { id: "gal",  label: "Gallon (US gal)",      toBase: v => v * 3.785412, fromBase: v => v / 3.785412 },
    ],
  },
};

function fmt(n: number): string {
  if (!isFinite(n)) return "∞";
  if (Math.abs(n) < 1e-10 && n !== 0) return n.toExponential(4);
  if (Math.abs(n) >= 1e10) return n.toExponential(4);
  const s = parseFloat(n.toPrecision(7)).toString();
  return s;
}

export function UnitConverterClient() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("km");
  const [toUnit, setToUnit] = useState("mi");
  const [inputVal, setInputVal] = useState("1");
  const [copied, setCopied] = useState(false);

  const cat = CATEGORIES[category];
  const from = cat.units.find((u) => u.id === fromUnit) ?? cat.units[0];
  const to = cat.units.find((u) => u.id === toUnit) ?? cat.units[1];

  const numInput = parseFloat(inputVal);
  const result = isNaN(numInput) ? null : to.fromBase(from.toBase(numInput));
  const resultStr = result !== null ? fmt(result) : "";

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  const copy = async () => {
    if (!resultStr) return;
    await navigator.clipboard.writeText(resultStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCategoryChange = (c: Category) => {
    setCategory(c);
    const units = CATEGORIES[c].units;
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id ?? units[0].id);
    setInputVal("1");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(CATEGORIES) as [Category, CategoryDef][]).map(([id, def]) => (
          <button
            key={id}
            onClick={() => handleCategoryChange(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              category === id
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
            }`}
          >
            {def.label}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {/* From */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5">Value</label>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {cat.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button onClick={swap} className="p-2 rounded-full border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors text-gray-400 hover:text-green-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5">Result</label>
            <div className="relative">
              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-mono text-gray-800 min-h-[52px]">
                {resultStr || <span className="text-gray-400 text-sm">—</span>}
              </div>
              {resultStr && (
                <button
                  onClick={copy}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-green-600 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1.5">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {cat.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {resultStr && (
          <p className="text-center text-sm text-gray-600 font-medium">
            {inputVal} {from.label} = <span className="text-green-700 font-bold">{resultStr}</span> {to.label}
          </p>
        )}
      </div>

      {/* All conversions for the input value */}
      {!isNaN(numInput) && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">All {cat.label.toLowerCase()} conversions for {inputVal} {from.label}</p>
          <div className="rounded-xl border border-gray-100 bg-white divide-y divide-gray-100">
            {cat.units.filter((u) => u.id !== fromUnit).map((u) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-gray-600">{u.label}</span>
                <span className="text-sm font-mono text-gray-800 font-medium">{fmt(u.fromBase(from.toBase(numInput)))}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
