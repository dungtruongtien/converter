import type { Metadata } from "next";
import { CronGeneratorClient } from "@/components/CronGeneratorClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "Cron Expression Generator — Build & Validate Cron Schedules",
  description: "Generate, validate, and understand cron expressions with a visual builder and human-readable descriptions. Free online cron generator with common schedule presets.",
  keywords: ["cron expression generator", "cron schedule builder", "cron syntax", "cron validator", "cron expression examples", "online cron generator"],
  alternates: { canonical: "/cron-generator" },
  openGraph: { type: "website", url: `${siteUrl}/cron-generator`, siteName: "ToolFree", title: "Cron Expression Generator — Free Online Tool", description: "Build and validate cron expressions with a visual builder and plain-English descriptions.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Cron Expression Generator — Free Online Tool", description: "Build cron schedules visually and get plain-English descriptions instantly." },
};

const faqs = [
  { q: "What is a cron expression?", a: "A cron expression is a string of 5 fields (minute, hour, day, month, weekday) that defines a recurring schedule. It is used by Unix cron jobs, CI/CD systems, serverless functions, and task schedulers to run jobs automatically at specified times." },
  { q: "What does * mean in a cron expression?", a: "An asterisk (*) means 'every' for that field. For example, '* * * * *' means every minute of every hour of every day." },
  { q: "What does */ mean in cron?", a: "The */ notation means 'every N units'. For example, */15 in the minute field means 'every 15 minutes', and */6 in the hour field means 'every 6 hours'." },
  { q: "What numbering does the weekday field use?", a: "The weekday field uses 0–6 where 0 = Sunday, 1 = Monday, ..., 6 = Saturday. Some systems also accept 7 for Sunday." },
  { q: "Does cron support seconds?", a: "Standard Unix cron (5 fields) does not support seconds. Some systems like Quartz (Java), AWS EventBridge, and GitHub Actions use 6-field cron with seconds. This tool uses the standard 5-field format." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Cron Expression Generator", url: `${siteUrl}/cron-generator`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free cron expression generator with visual field builder, plain-English descriptions, and common schedule presets." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to generate a cron expression", step: [{ "@type": "HowToStep", position: 1, name: "Pick a preset or use the builder", text: "Select a common schedule from the presets, or use the visual field builder to set minute, hour, day, month, and weekday individually." }, { "@type": "HowToStep", position: 2, name: "Read the description", text: "The tool shows a plain-English description of your schedule in real time so you can verify it is correct." }, { "@type": "HowToStep", position: 3, name: "Copy the expression", text: "Click Copy to copy the cron expression to your clipboard and paste it into your scheduler or CI/CD config." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Cron Expression Generator", item: `${siteUrl}/cron-generator` }] },
];

export default function CronGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Cron Expression Generator</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Build cron schedules with a visual builder, get plain-English descriptions, and pick from common presets.</p>
        </div>
      </section>
      <CronGeneratorClient />
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
      <RelatedTools current="cron-generator" />
    </>
  );
}
