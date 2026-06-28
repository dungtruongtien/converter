import type { Metadata } from "next";
import RandomPickerClient from "@/components/RandomPickerClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Random Picker — Pick from List, Numbers, Dice, Cards",
  description: "Pick randomly from a custom list, generate random numbers, flip a coin, roll dice, or draw cards. Free, instant, runs in your browser.",
  keywords: ["random picker", "random name picker", "random number generator", "coin flip", "dice roller", "random card draw", "pick from list"],
  alternates: { canonical: "/random-picker" },
  openGraph: { type: "website", url: `${siteUrl}/random-picker`, siteName: "Gadify", title: "Random Picker — List, Numbers, Dice, Cards, Coin", description: "Pick randomly from a list, generate numbers, flip coins, roll dice, draw cards.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Random Picker — Free Online Tool", description: "Pick from a custom list, generate random numbers, flip a coin, roll dice, or draw cards." },
};

export default function RandomPickerPage() {
  return (
    <>
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Random Picker</h1>
          <p className="text-gray-500 max-w-md mx-auto">Pick from a list, generate random numbers, flip a coin, roll dice, or draw cards — all in one place.</p>
        </div>
      </section>
      <RandomPickerClient />
      <RelatedTools current="random-picker" />
    </>
  );
}
