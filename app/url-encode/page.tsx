import type { Metadata } from "next";
import { UrlEncodeClient } from "@/components/UrlEncodeClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "URL Encode / Decode — Free Online Percent-Encoding Tool",
  description: "Encode strings for use in URLs (percent-encoding) or decode percent-encoded URLs back to readable text. Free, instant, runs in your browser.",
  keywords: ["url encode", "url decode", "percent encoding", "url encoder decoder", "urlencode online", "encode url free"],
  alternates: { canonical: "/url-encode" },
  openGraph: { type: "website", url: `${siteUrl}/url-encode`, siteName: "ToolFree", title: "URL Encode / Decode — Free Online Tool", description: "Percent-encode or decode URL strings instantly. Runs in your browser.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "URL Encode / Decode — Free Online Tool", description: "Encode or decode percent-encoded URL strings instantly." },
};

const faqs = [
  { q: "What is URL encoding?", a: "URL encoding (also called percent-encoding) replaces unsafe characters in a URL with a percent sign followed by their hexadecimal ASCII code. For example, a space becomes %20 and & becomes %26. This ensures the URL is valid and correctly interpreted by browsers and servers." },
  { q: "What characters get encoded?", a: "This tool uses encodeURIComponent, which encodes all characters except letters (A–Z, a–z), digits (0–9), and the unreserved characters - _ . ! ~ * ' ( ). Special characters like spaces, &, =, ?, #, and / are all encoded." },
  { q: "When should I encode a full URL vs individual components?", a: "You should encode individual query parameter values, not full URLs. Encoding a full URL will also encode the slashes (//) and colons in https://, breaking it. This tool encodes individual values — use it on the value of a query parameter, not the whole URL." },
  { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI is for encoding full URLs and leaves characters like /, ?, #, and & intact. encodeURIComponent encodes everything except unreserved characters and is for encoding individual URL components like query parameter values. This tool uses encodeURIComponent." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "URL Encode / Decode", url: `${siteUrl}/url-encode`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free online URL encoder and decoder. Percent-encode strings for use in URLs or decode them back to readable text." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to URL encode or decode online", step: [{ "@type": "HowToStep", position: 1, name: "Choose encode or decode", text: "Select Encode to percent-encode a string, or Decode to convert %XX sequences back to text." }, { "@type": "HowToStep", position: 2, name: "Paste your input", text: "Type or paste the string you want to encode or decode." }, { "@type": "HowToStep", position: 3, name: "Copy the result", text: "The result appears instantly. Click Copy to copy it to your clipboard." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "URL Encode / Decode", item: `${siteUrl}/url-encode` }] },
];

export default function UrlEncodePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">URL Encode / Decode</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Percent-encode strings for URLs or decode them back to readable text. Runs entirely in your browser.</p>
        </div>
      </section>
      <UrlEncodeClient />
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
      <RelatedTools current="url-encode" />
    </>
  );
}
