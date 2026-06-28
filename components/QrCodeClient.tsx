"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type QrType =
  | "url" | "text" | "wifi" | "vcard" | "email" | "sms" | "phone"
  | "payment" | "calendar" | "geo";

const TYPES: { id: QrType; label: string; emoji: string; desc: string }[] = [
  { id: "url",      label: "URL / Link",       emoji: "🔗", desc: "Website address" },
  { id: "text",     label: "Plain Text",        emoji: "📄", desc: "Any text" },
  { id: "wifi",     label: "Wi-Fi",             emoji: "📶", desc: "Auto-connect to network" },
  { id: "vcard",    label: "Contact (vCard)",   emoji: "👤", desc: "Scan to save contact" },
  { id: "email",    label: "Email",             emoji: "✉️",  desc: "Pre-fill email draft" },
  { id: "sms",      label: "SMS",               emoji: "💬", desc: "Pre-fill text message" },
  { id: "phone",    label: "Phone",             emoji: "📞", desc: "Click-to-call" },
  { id: "payment",  label: "Payment / VietQR",  emoji: "💳", desc: "Bank transfer QR" },
  { id: "calendar", label: "Calendar Event",    emoji: "📅", desc: "Add to calendar" },
  { id: "geo",      label: "Geo Location",      emoji: "📍", desc: "Open in maps" },
];

function buildQrData(type: QrType, fields: Record<string, string>): string {
  switch (type) {
    case "url":    return fields.url || "";
    case "text":   return fields.text || "";
    case "wifi":   return `WIFI:S:${fields.ssid};T:${fields.security || "WPA"};P:${fields.password};H:${fields.hidden === "true" ? "true" : "false"};;`;
    case "vcard":  return [
        "BEGIN:VCARD", "VERSION:3.0",
        fields.name    ? `FN:${fields.name}` : "",
        fields.org     ? `ORG:${fields.org}` : "",
        fields.phone   ? `TEL:${fields.phone}` : "",
        fields.email   ? `EMAIL:${fields.email}` : "",
        fields.website ? `URL:${fields.website}` : "",
        fields.address ? `ADR:;;${fields.address};;;;` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    case "email":  return `mailto:${fields.to}?subject=${encodeURIComponent(fields.subject || "")}&body=${encodeURIComponent(fields.body || "")}`;
    case "sms":    return `smsto:${fields.phone}:${fields.message || ""}`;
    case "phone":  return `tel:${fields.phone}`;
    case "payment": {
      if (fields.paymentType === "vietqr") {
        return `${fields.bankBin}|${fields.accountNumber}|${fields.accountName}|${fields.amount}|${fields.message}`;
      }
      return fields.paymentData || "";
    }
    case "calendar": {
      const fmt = (d: string) => d.replace(/[-:T]/g, "").slice(0, 15) + "Z";
      return [
        "BEGIN:VEVENT",
        `SUMMARY:${fields.title}`,
        `DTSTART:${fmt(fields.start || "")}`,
        `DTEND:${fmt(fields.end || "")}`,
        fields.location ? `LOCATION:${fields.location}` : "",
        fields.description ? `DESCRIPTION:${fields.description}` : "",
        "END:VEVENT",
      ].filter(Boolean).join("\n");
    }
    case "geo": return `geo:${fields.lat},${fields.lng}`;
    default: return "";
  }
}

// Module-level sub-components so React never remounts them on parent re-render

type SetField = (key: string, val: string) => void;

function QrInput({
  label, fieldKey, fields, set, placeholder, type = "text",
}: {
  label: string; fieldKey: string; fields: Record<string, string>; set: SetField; placeholder?: string; type?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type={resolvedType}
          value={fields[fieldKey]}
          onChange={(e) => set(fieldKey, e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function QrTextarea({
  label, fieldKey, fields, set, placeholder, rows = 3,
}: {
  label: string; fieldKey: string; fields: Record<string, string>; set: SetField; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <textarea
        value={fields[fieldKey]}
        onChange={(e) => set(fieldKey, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function QrSelect({
  label, fieldKey, fields, set, options,
}: {
  label: string; fieldKey: string; fields: Record<string, string>; set: SetField; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <select
        value={fields[fieldKey]}
        onChange={(e) => set(fieldKey, e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function QrCodeClient() {
  const [type, setType] = useState<QrType>("url");
  const [fields, setFields] = useState<Record<string, string>>({
    url: "https://",
    text: "",
    ssid: "", security: "WPA", password: "", hidden: "false",
    name: "", org: "", phone: "", email: "", website: "", address: "",
    to: "", subject: "", body: "",
    message: "",
    paymentType: "vietqr", bankBin: "", accountNumber: "", accountName: "", amount: "",
    paymentData: "",
    title: "", start: "", end: "", location: "", description: "",
    lat: "", lng: "",
  });
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const set = useCallback((key: string, val: string) => setFields((f) => ({ ...f, [key]: val })), []);

  const generate = useCallback(async () => {
    const data = buildQrData(type, fields);
    if (!data.trim()) { setQrDataUrl(null); return; }
    setGenerating(true);
    setError(null);
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      setQrDataUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate QR code. Input may be too long.");
      setQrDataUrl(null);
    } finally {
      setGenerating(false);
    }
  }, [type, fields, fgColor, bgColor, size, errorLevel]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(generate, 400);
    return () => clearTimeout(debounceRef.current);
  }, [generate]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qr-code.png";
    a.click();
  };

  // Shared props passed to each sub-component so they stay stable
  const fp = { fields, set };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        {/* Left: type + fields */}
        <div className="space-y-5">
          {/* Type selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`rounded-xl border px-2 py-2.5 text-xs font-medium text-center transition-all ${
                  type === t.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <div className="text-lg mb-0.5">{t.emoji}</div>
                <div className="font-semibold leading-tight">{t.label}</div>
                <div className={`text-xs leading-tight mt-0.5 ${type === t.id ? "text-indigo-200" : "text-gray-400"}`}>{t.desc}</div>
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            {type === "url" && (
              <QrInput {...fp} label="Website URL" fieldKey="url" placeholder="https://example.com" />
            )}

            {type === "text" && (
              <QrTextarea {...fp} label="Text content" fieldKey="text" placeholder="Enter any text…" rows={5} />
            )}

            {type === "wifi" && <>
              <QrInput {...fp} label="Network name (SSID)" fieldKey="ssid" placeholder="MyWiFiNetwork" />
              <QrSelect {...fp} label="Security" fieldKey="security" options={[
                { value: "WPA", label: "WPA/WPA2" },
                { value: "WEP", label: "WEP" },
                { value: "", label: "None (open)" },
              ]} />
              <QrInput {...fp} label="Password" fieldKey="password" placeholder="••••••••" type="password" />
              <QrSelect {...fp} label="Hidden network?" fieldKey="hidden" options={[
                { value: "false", label: "No" },
                { value: "true", label: "Yes" },
              ]} />
            </>}

            {type === "vcard" && <>
              <div className="grid grid-cols-2 gap-3">
                <QrInput {...fp} label="Full name" fieldKey="name" placeholder="Jane Smith" />
                <QrInput {...fp} label="Organization" fieldKey="org" placeholder="Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <QrInput {...fp} label="Phone" fieldKey="phone" placeholder="+84 123 456 789" />
                <QrInput {...fp} label="Email" fieldKey="email" placeholder="jane@example.com" type="email" />
              </div>
              <QrInput {...fp} label="Website" fieldKey="website" placeholder="https://janesmith.com" />
              <QrInput {...fp} label="Address" fieldKey="address" placeholder="123 Street, City, Country" />
            </>}

            {type === "email" && <>
              <QrInput {...fp} label="To (email address)" fieldKey="to" placeholder="hello@example.com" type="email" />
              <QrInput {...fp} label="Subject" fieldKey="subject" placeholder="Hello!" />
              <QrTextarea {...fp} label="Body (optional)" fieldKey="body" placeholder="Your message…" />
            </>}

            {type === "sms" && <>
              <QrInput {...fp} label="Phone number" fieldKey="phone" placeholder="+84 123 456 789" />
              <QrTextarea {...fp} label="Pre-filled message" fieldKey="message" placeholder="Type your message…" rows={3} />
            </>}

            {type === "phone" && (
              <QrInput {...fp} label="Phone number" fieldKey="phone" placeholder="+84 123 456 789" />
            )}

            {type === "payment" && <>
              <QrSelect {...fp} label="Payment type" fieldKey="paymentType" options={[
                { value: "vietqr", label: "VietQR (Vietnamese bank transfer)" },
                { value: "custom", label: "Custom / Other" },
              ]} />
              {fields.paymentType === "vietqr" && <>
                <QrInput {...fp} label="Bank BIN code" fieldKey="bankBin" placeholder="970436 (Vietcombank)" />
                <QrInput {...fp} label="Account number" fieldKey="accountNumber" placeholder="0123456789" />
                <QrInput {...fp} label="Account name" fieldKey="accountName" placeholder="NGUYEN VAN A" />
                <div className="grid grid-cols-2 gap-3">
                  <QrInput {...fp} label="Amount (VND, optional)" fieldKey="amount" placeholder="50000" />
                  <QrInput {...fp} label="Transfer note" fieldKey="message" placeholder="Thanh toan" />
                </div>
              </>}
              {fields.paymentType === "custom" && (
                <QrTextarea {...fp} label="Payment data" fieldKey="paymentData" placeholder="Paste your payment string or URI…" rows={4} />
              )}
            </>}

            {type === "calendar" && <>
              <QrInput {...fp} label="Event title" fieldKey="title" placeholder="Team Meeting" />
              <div className="grid grid-cols-2 gap-3">
                <QrInput {...fp} label="Start (local time)" fieldKey="start" type="datetime-local" />
                <QrInput {...fp} label="End (local time)" fieldKey="end" type="datetime-local" />
              </div>
              <QrInput {...fp} label="Location (optional)" fieldKey="location" placeholder="Zoom / Conference room B" />
              <QrTextarea {...fp} label="Description (optional)" fieldKey="description" placeholder="Agenda…" rows={2} />
            </>}

            {type === "geo" && <>
              <div className="grid grid-cols-2 gap-3">
                <QrInput {...fp} label="Latitude" fieldKey="lat" placeholder="21.0278" />
                <QrInput {...fp} label="Longitude" fieldKey="lng" placeholder="105.8342" />
              </div>
              <p className="text-xs text-gray-400">Tip: right-click any location on Google Maps → copy coordinates.</p>
            </>}
          </div>
        </div>

        {/* Right: QR preview + export */}
        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col items-center gap-3">
            <div
              className="rounded-xl overflow-hidden flex items-center justify-center"
              style={{ width: 200, height: 200, backgroundColor: bgColor }}
            >
              {generating ? (
                <svg className="w-8 h-8 text-gray-300 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="QR Code" width={200} height={200} />
              ) : (
                <div className="text-center text-gray-300 text-xs px-4">
                  <div className="text-4xl mb-2 opacity-40">▦</div>
                  Fill in the fields to generate a QR code
                </div>
              )}
            </div>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          </div>

          {/* Customisation */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Appearance</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Foreground</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-6 h-6 border-0 p-0 cursor-pointer rounded" />
                  <span className="text-xs font-mono text-gray-600">{fgColor}</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Background</label>
<div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 border-0 p-0 cursor-pointer rounded" />
                  <span className="text-xs font-mono text-gray-600">{bgColor}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Size: {size}×{size}px</label>
              <input
                type="range" min={128} max={512} step={32}
                value={size} onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Error correction</label>
              <div className="flex gap-1">
                {(["L", "M", "Q", "H"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setErrorLevel(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      errorLevel === lvl ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">L=7% · M=15% · Q=25% · H=30% recovery</p>
            </div>
          </div>

          {/* Download */}
          {qrDataUrl && (
            <button
              onClick={download}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
            >
              ⬇ Download PNG
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
