import type { Metadata } from "next";
import LoanCalculatorClient from "@/components/LoanCalculatorClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Loan & Mortgage Calculator — Free Online Tool",
  description: "Calculate monthly loan payments, total interest, and see a full amortization schedule. Works for mortgages, car loans, personal loans. Free, instant, browser-only.",
  keywords: ["loan calculator", "mortgage calculator", "monthly payment calculator", "amortization schedule", "interest calculator", "home loan calculator", "car loan calculator"],
  alternates: { canonical: "/loan-calculator" },
  openGraph: { type: "website", url: `${siteUrl}/loan-calculator`, siteName: "Gadify", title: "Loan & Mortgage Calculator — Free", description: "Monthly payment, total interest, and full amortization schedule. Instant.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Loan & Mortgage Calculator — Free Online Tool", description: "Calculate monthly payments and see a full amortization schedule for any loan." },
};

const faqs = [
  { q: "What is the difference between annuity and declining balance?", a: "Annuity (fixed payment) keeps the monthly payment constant — principal share increases and interest share decreases each month. Declining balance keeps the principal payment fixed, so total interest paid is lower but early payments are higher." },
  { q: "How is the monthly payment calculated?", a: "For a fixed-rate annuity: M = P × [r(1+r)^n] / [(1+r)^n − 1], where P = principal, r = monthly rate, n = number of months." },
  { q: "Does this include property tax or insurance (PITI)?", a: "No — this calculates principal + interest only. Add your estimated tax and insurance costs separately to get your full monthly housing expense." },
  { q: "Can I use this for any currency?", a: "Yes. The currency symbol is just a display label. Enter your loan amount in any currency and the math is the same." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Loan & Mortgage Calculator", url: `${siteUrl}/loan-calculator`, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Loan Calculator", item: `${siteUrl}/loan-calculator` }] },
];

export default function LoanCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Loan & Mortgage Calculator</h1>
          <p className="text-gray-500 max-w-md mx-auto">Monthly payment, total interest, and full amortization schedule — free and instant.</p>
        </div>
      </section>
      <LoanCalculatorClient />
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
      <RelatedTools current="loan-calculator" />
    </>
  );
}
