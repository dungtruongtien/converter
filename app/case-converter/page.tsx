import type { Metadata } from "next";
import { CaseConverterClient } from "@/components/CaseConverterClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "Case Converter — UPPER, lower, Title, camelCase, snake_case & More",
  description: "Convert text between UPPER CASE, lower case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE. Free, instant, no signup.",
  keywords: ["case converter", "text case converter", "camelcase converter", "snake case converter", "title case", "uppercase converter", "kebab case"],
  alternates: { canonical: "/case-converter" },
  openGraph: { type: "website", url: `${siteUrl}/case-converter`, siteName: "ToolFree", title: "Case Converter — Free Online Tool", description: "Convert text between all common cases: UPPER, lower, Title, camelCase, PascalCase, snake_case, kebab-case.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Case Converter — Free Online Tool", description: "Instantly convert text to camelCase, PascalCase, snake_case, kebab-case, and more." },
};

const faqs = [
  { q: "What is camelCase?", a: "camelCase joins words together with no spaces, capitalising the first letter of each word except the first (e.g. 'helloWorldExample'). It is commonly used in JavaScript variable names." },
  { q: "What is the difference between PascalCase and camelCase?", a: "PascalCase (also called UpperCamelCase) capitalises the first letter of every word including the first (e.g. 'HelloWorldExample'). It is commonly used for class and component names." },
  { q: "What is snake_case?", a: "snake_case replaces spaces with underscores and uses all lowercase (e.g. 'hello_world_example'). It is widely used in Python, Ruby, and SQL." },
  { q: "What is kebab-case?", a: "kebab-case replaces spaces with hyphens and uses all lowercase (e.g. 'hello-world-example'). It is the standard for URL slugs and CSS class names." },
  { q: "Can I convert from camelCase back to normal text?", a: "Yes. Paste any camelCase, PascalCase, snake_case, or kebab-case string and the tool will detect the word boundaries and convert it to your chosen format." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Case Converter", url: `${siteUrl}/case-converter`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Convert text between UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to convert text case online", step: [{ "@type": "HowToStep", position: 1, name: "Enter your text", text: "Type or paste the text you want to convert." }, { "@type": "HowToStep", position: 2, name: "Choose a case format", text: "Click any case button — UPPER, lower, Title, camelCase, snake_case, and more." }, { "@type": "HowToStep", position: 3, name: "Copy the result", text: "Click Copy to copy the converted text to your clipboard." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Case Converter", item: `${siteUrl}/case-converter` }] },
];

export default function CaseConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Case Converter</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Convert text to UPPER, lower, Title, camelCase, PascalCase, snake_case, kebab-case, and more.</p>
        </div>
      </section>
      <CaseConverterClient />
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
      <RelatedTools current="case-converter" />
    </>
  );
}
