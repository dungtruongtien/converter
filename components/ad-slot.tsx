"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "leaderboard" | "banner";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || ins.getAttribute('data-adsbygoogle-status')) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!clientId && process.env.NODE_ENV !== "production") {
    return (
      <div
        className={["border-2 border-dashed border-gray-200 rounded bg-gray-50 flex items-center justify-center text-gray-400 text-xs", className].join(" ")}
        style={{ minHeight: format === "leaderboard" ? 90 : format === "rectangle" ? 250 : 60 }}
      >
        AdSense slot: {slot}
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId ?? "ca-pub-XXXXXXXXXXXXXXXX"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
