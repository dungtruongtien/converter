import type { Metadata } from "next";
import PercentageCalculatorClient from "@/components/PercentageCalculatorClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Percentage Calculator — Free Online Tool",
  description: "Calculate percentages instantly: what is X% of Y, what percentage is X of Y, percentage change, add or subtract a percentage. Free and runs in your browser.",
  keywords: ["percentage calculator", "percent calculator", "what is x percent of y", "percentage change calculator", "add percentage", "percent increase decrease"],
  alternates: { canonical: "/percentage-calculator" },
  openGraph: { type: "website", url: `${siteUrl}/percentage-calculator`, siteName: "Gadify", title: "Percentage Calculator — Free", description: "Calculate percentages in 5 modes. Instant results, no signup.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Percentage Calculator — Free Online Tool", description: "What is X% of Y? What % is X of Y? Change, add, subtract — all modes covered." },
};

const faqs = [
  { q: "How do I calculate what percentage one number is of another?", a: "Use the 'What % is X of Y?' mode. Divide X by Y and multiply by 100. For example, 25 out of 80 = (25/80)×100 = 31.25%." },
  { q: "How do I calculate a percentage increase or decrease?", a: "Use the '% change' mode. The formula is ((new − old) / |old|) × 100. A positive result is an increase; negative is a decrease." },
  { q: "How do I add or subtract a percentage from a number?", a: "Use 'Add %' or 'Subtract %'. Adding 20% to 150 = 150 × 1.20 = 180. Subtracting 20% = 150 × 0.80 = 120." },
  { q: "What is 'X% of Y'?", a: "Multiply X/100 by Y. For example, 15% of 200 = (15/100) × 200 = 30." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Percentage Calculator", url: `${siteUrl}/percentage-calculator`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Percentage Calculator", item: `${siteUrl}/percentage-calculator` }] },
];

export default function PercentageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Percentage Calculator</h1>
          <p className="text-gray-500 max-w-md mx-auto">Calculate percentages in 5 different modes — instantly, in your browser.</p>
        </div>
      </section>
      <PercentageCalculatorClient />
      <section className="max-w-2xl mx-auto px-4 py-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{q}</h3>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </section>
      <RelatedTools current="percentage-calculator" />
    </>
  );
}
