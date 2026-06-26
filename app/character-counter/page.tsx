import type { Metadata } from "next";
import { CharacterCounterClient } from "@/components/CharacterCounterClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Character Counter — Count Characters Online Free",
  description: "Count characters with and without spaces, letters, digits, and check Twitter, SMS, and SEO character limits. Free, instant, no signup.",
  keywords: ["character counter", "character count", "count characters online", "twitter character counter", "sms character limit", "meta description length"],
  alternates: { canonical: "/character-counter" },
  openGraph: { type: "website", url: `${siteUrl}/character-counter`, siteName: "Gadify", title: "Character Counter — Free Online Tool", description: "Count characters and check platform limits for Twitter, SMS, and SEO.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Character Counter — Free Online Tool", description: "Instant character count with Twitter, SMS, and SEO limit checker." },
};

const faqs = [
  { q: "What is the difference between characters with and without spaces?", a: "'Characters with spaces' counts every character including spaces. 'Characters without spaces' counts only non-whitespace characters, which is useful for certain publishing and typesetting requirements." },
  { q: "Why does Twitter show a different count than this tool?", a: "Twitter counts some URLs and emoji differently using their own t.co link shortener. This tool counts raw characters, so there may be small differences for tweets containing URLs or emoji sequences." },
  { q: "What counts as a special character?", a: "Special characters are anything that is not a letter (a–z, A–Z), digit (0–9), or whitespace. This includes punctuation, symbols, emoji, and non-Latin characters." },
  { q: "Is there a limit on how much text I can enter?", a: "No limit. The counter works in your browser and handles large documents without any issues." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Character Counter", url: `${siteUrl}/character-counter`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free character counter with platform limit indicators for Twitter, SMS, and SEO." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to count characters online", step: [{ "@type": "HowToStep", position: 1, name: "Type or paste text", text: "Enter your text in the input area." }, { "@type": "HowToStep", position: 2, name: "View character breakdown", text: "See total characters, letters, digits, spaces, and special characters instantly." }, { "@type": "HowToStep", position: 3, name: "Check platform limits", text: "See progress bars showing how your text fits within Twitter, SMS, and SEO limits." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Character Counter", item: `${siteUrl}/character-counter` }] },
];

export default function CharacterCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Character Counter</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Count characters, letters, digits, and check Twitter, SMS, and SEO limits in real time.</p>
        </div>
      </section>
      <CharacterCounterClient />
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{q}</h3>
                <p className="text-sm text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <RelatedTools current="character-counter" />
    </>
  );
}
