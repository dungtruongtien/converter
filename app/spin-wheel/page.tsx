import type { Metadata } from "next";
import SpinWheelClient from "@/components/SpinWheelClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Spin the Wheel — Free Random Decision Maker",
  description: "Spin a customizable wheel to make random decisions. Add your own options, spin to pick a winner. Great for giveaways, classroom activities, team decisions, and games.",
  keywords: ["spin the wheel", "random wheel spinner", "decision wheel", "random picker wheel", "wheel of names", "random choice wheel"],
  alternates: { canonical: "/spin-wheel" },
  openGraph: { type: "website", url: `${siteUrl}/spin-wheel`, siteName: "Gadify", title: "Spin the Wheel — Free Random Decision Maker", description: "Customizable spin wheel. Add options, spin, pick a winner.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Spin the Wheel — Free Random Decision Maker", description: "Spin a customizable wheel to randomly pick from your list of options." },
};

export default function SpinWheelPage() {
  return (
    <>
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Spin the Wheel</h1>
          <p className="text-gray-500 max-w-md mx-auto">Add your options, spin to pick a random winner. Perfect for giveaways, decisions, and games.</p>
        </div>
      </section>
      <SpinWheelClient />
      <RelatedTools current="spin-wheel" />
    </>
  );
}
