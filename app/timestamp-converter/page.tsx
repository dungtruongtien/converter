import type { Metadata } from "next";
import { TimestampConverterClient } from "@/components/TimestampConverterClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "Timestamp Converter — Unix Time to Date & Date to Unix",
  description: "Convert Unix timestamps to human-readable dates and times, or convert dates back to Unix timestamps. Shows UTC, local time, ISO 8601, and relative time. Free.",
  keywords: ["unix timestamp converter", "timestamp to date", "date to unix timestamp", "epoch converter", "unix time converter", "epoch time"],
  alternates: { canonical: "/timestamp-converter" },
  openGraph: { type: "website", url: `${siteUrl}/timestamp-converter`, siteName: "ToolFree", title: "Timestamp Converter — Free Online Tool", description: "Convert Unix timestamps to dates or dates to Unix timestamps. Shows UTC, local, ISO 8601.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Timestamp Converter — Free Online Tool", description: "Convert Unix timestamps to readable dates or dates to Unix epoch time." },
};

const faqs = [
  { q: "What is a Unix timestamp?", a: "A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC (the Unix epoch). It is a universal way to represent a point in time as a single integer, used widely in databases, APIs, and programming." },
  { q: "What is the difference between seconds and milliseconds timestamps?", a: "Unix timestamps are traditionally in seconds (10 digits). JavaScript uses milliseconds (13 digits). For example, 1700000000 is seconds; 1700000000000 is the same moment in milliseconds. This tool auto-detects which one you entered." },
  { q: "What is the maximum Unix timestamp?", a: "The maximum 32-bit signed Unix timestamp is 2,147,483,647, which corresponds to January 19, 2038 at 03:14:07 UTC. This is the '2038 problem'. 64-bit systems extend this far beyond the foreseeable future." },
  { q: "What is ISO 8601?", a: "ISO 8601 is an international standard for representing dates and times as strings, e.g. '2024-01-15T12:00:00.000Z'. The 'Z' at the end means UTC. It is the format used by JSON APIs and is directly parseable by JavaScript's Date object." },
  { q: "What does UTC mean?", a: "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks. Unix timestamps are always in UTC, and converting to local time depends on your device's timezone setting." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Timestamp Converter", url: `${siteUrl}/timestamp-converter`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Convert Unix timestamps to human-readable dates (UTC, local, ISO 8601) or dates back to Unix timestamps." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to convert a Unix timestamp to a date", step: [{ "@type": "HowToStep", position: 1, name: "Choose conversion direction", text: "Select 'Unix → Date' to convert a timestamp to a date, or 'Date → Unix' to convert a date string to a Unix timestamp." }, { "@type": "HowToStep", position: 2, name: "Enter the value", text: "Paste your Unix timestamp (seconds or milliseconds) or date string." }, { "@type": "HowToStep", position: 3, name: "Copy the result", text: "The tool shows UTC, local time, ISO 8601, relative time, and day of week. Copy any value with one click." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Timestamp Converter", item: `${siteUrl}/timestamp-converter` }] },
];

export default function TimestampConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Timestamp Converter</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Convert Unix timestamps to human-readable dates (UTC, local, ISO 8601) or dates back to Unix epoch time.</p>
        </div>
      </section>
      <TimestampConverterClient />
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
      <RelatedTools current="timestamp-converter" />
    </>
  );
}
