"use client";

import { useEffect, useRef } from "react";

const adsenseId =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "")
    : "";

function SidebarAdSlot({ slot, side }: { slot: string; side: "left" | "right" }) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins || ins.getAttribute("data-adsbygoogle-status")) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, []);

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div
      className={`hidden xl:flex fixed top-1/2 -translate-y-1/2 z-40 flex-col items-center justify-center ${
        side === "left" ? "left-2" : "right-2"
      }`}
      style={{ width: 160 }}
      aria-label="Advertisement"
    >
      {isDev || !adsenseId ? (
        /* Dev placeholder */
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-gray-400 text-xs gap-1 select-none"
          style={{ width: 160, height: 600 }}
        >
          <span className="font-medium">Ad</span>
          <span>160×600</span>
          <span className="opacity-60">{side}</span>
        </div>
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "inline-block", width: 160, height: 600 }}
          data-ad-client={adsenseId}
          data-ad-slot={slot}
        />
      )}
    </div>
  );
}

export function SidebarAds() {
  return (
    <>
      <SidebarAdSlot slot="1111111111" side="left" />
      <SidebarAdSlot slot="2222222222" side="right" />
    </>
  );
}
