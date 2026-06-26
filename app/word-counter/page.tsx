import type { Metadata } from "next";
import { WordCounterClient } from "@/components/WordCounterClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "Word Counter — Free Online Word Count Tool",
  description: "Count words, characters, sentences, paragraphs, and reading time instantly. Free online word counter — no signup, works in your browser.",
  keywords: ["word counter", "word count", "character counter", "count words online", "word counter free", "online word count tool"],
  alternates: { canonical: "/word-counter" },
  openGraph: { type: "website", url: `${siteUrl}/word-counter`, siteName: "ToolFree", title: "Word Counter — Free Online Tool", description: "Count words, characters, sentences, and reading time in seconds.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Word Counter — Free Online Tool", description: "Instant word count, character count, reading time and more." },
};

const faqs = [
  { q: "How accurate is the word counter?", a: "The counter splits on whitespace and filters empty tokens, matching the standard definition of a word. Hyphenated words like 'well-known' count as one word." },
  { q: "Does it count characters with or without spaces?", a: "Both. The tool shows character count with spaces and without spaces separately so you can use whichever metric you need." },
  { q: "How is reading time calculated?", a: "Reading time is estimated at 200 words per minute, which is a common average for general reading. Academic or technical text may take longer." },
  { q: "Is there a word limit?", a: "No. You can paste as much text as you like — entire books, essays, or articles. The counter updates live as you type." },
  { q: "Do you store my text?", a: "No. All counting happens entirely in your browser. Your text never leaves your device." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Word Counter", url: `${siteUrl}/word-counter`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free online word counter. Count words, characters, sentences, paragraphs, and reading time instantly." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to count words online", step: [{ "@type": "HowToStep", position: 1, name: "Paste your text", text: "Paste or type your text into the input area." }, { "@type": "HowToStep", position: 2, name: "View live stats", text: "Word count, character count, sentences, and reading time update instantly." }, { "@type": "HowToStep", position: 3, name: "Use the results", text: "Use the stats for essays, SEO copy, social media posts, or any writing project." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Word Counter", item: `${siteUrl}/word-counter` }] },
];

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Word Counter</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Count words, characters, sentences, paragraphs, and reading time. Live updates as you type.</p>
        </div>
      </section>
      <WordCounterClient />
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
      <RelatedTools current="word-counter" />
    </>
  );
}
