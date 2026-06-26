import type { Metadata } from "next";
import { Base64Client } from "@/components/Base64Client";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "Base64 Encode / Decode — Free Online Tool",
  description: "Encode text to Base64 or decode Base64 strings back to plain text. Supports Unicode. Free, instant, runs in your browser — no data sent to any server.",
  keywords: ["base64 encode", "base64 decode", "base64 encoder decoder", "base64 online", "encode base64 free", "decode base64 string"],
  alternates: { canonical: "/base64" },
  openGraph: { type: "website", url: `${siteUrl}/base64`, siteName: "ToolFree", title: "Base64 Encode / Decode — Free Online Tool", description: "Encode or decode Base64 strings instantly. Supports Unicode. Runs in your browser.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Base64 Encode / Decode — Free Online Tool", description: "Instantly encode text to Base64 or decode Base64 back to plain text." },
};

const faqs = [
  { q: "What is Base64?", a: "Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 ASCII characters (A–Z, a–z, 0–9, +, /). It is widely used for embedding images in HTML/CSS, encoding email attachments, and passing binary data through text-only channels." },
  { q: "Is Base64 encryption?", a: "No. Base64 is encoding, not encryption. It is easily reversible and provides no security. Never use Base64 to protect sensitive data — use proper encryption instead." },
  { q: "Does this tool support Unicode and emoji?", a: "Yes. The encoder uses encodeURIComponent + btoa to handle the full Unicode range including emoji, Chinese, Arabic, and all other scripts." },
  { q: "What does the '=' padding at the end mean?", a: "Base64 works in groups of 3 bytes. If the input is not a multiple of 3 bytes, padding characters ('=') are added to complete the final group. One '=' means 1 padding byte; '==' means 2." },
  { q: "Can I use this for JWT tokens?", a: "JWT uses Base64URL encoding (which replaces + with - and / with _). This tool uses standard Base64. You can use it to inspect JWT payloads but the output may include + and / characters." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Base64 Encode / Decode", url: `${siteUrl}/base64`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free online Base64 encoder and decoder. Supports Unicode. Runs entirely in the browser." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to encode or decode Base64 online", step: [{ "@type": "HowToStep", position: 1, name: "Choose encode or decode", text: "Select 'Encode' to convert plain text to Base64, or 'Decode' to convert a Base64 string back to text." }, { "@type": "HowToStep", position: 2, name: "Paste your input", text: "Type or paste your text or Base64 string into the input area." }, { "@type": "HowToStep", position: 3, name: "Copy the output", text: "The result appears instantly. Click Copy to copy it to your clipboard." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Base64 Encode / Decode", item: `${siteUrl}/base64` }] },
];

export default function Base64Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Base64 Encode / Decode</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Encode text to Base64 or decode Base64 back to plain text. Supports Unicode. Runs entirely in your browser.</p>
        </div>
      </section>
      <Base64Client />
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
      <RelatedTools current="base64" />
    </>
  );
}
