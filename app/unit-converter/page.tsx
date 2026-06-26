import type { Metadata } from "next";
import { UnitConverterClient } from "@/components/UnitConverterClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "Unit Converter — Length, Weight, Temperature, Speed & More",
  description: "Convert between units of length (km/miles), weight (kg/lbs), temperature (°C/°F), speed, area, and volume. Free online unit converter, instant results.",
  keywords: ["unit converter", "km to miles", "kg to lbs", "celsius to fahrenheit", "length converter", "weight converter", "temperature converter", "metric imperial converter"],
  alternates: { canonical: "/unit-converter" },
  openGraph: { type: "website", url: `${siteUrl}/unit-converter`, siteName: "ToolFree", title: "Unit Converter — Free Online Tool", description: "Convert length, weight, temperature, speed, area, and volume between metric and imperial units.", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Unit Converter — Free Online Tool", description: "Convert km to miles, kg to lbs, Celsius to Fahrenheit, and more." },
};

const faqs = [
  { q: "How do I convert km to miles?", a: "1 kilometre = 0.621371 miles. Select the Length category, choose Kilometers as the 'From' unit and Miles as the 'To' unit, then enter your value." },
  { q: "How do I convert kg to lbs?", a: "1 kilogram = 2.20462 pounds. Select the Weight/Mass category, choose Kilograms and Pounds, then enter your value." },
  { q: "How do I convert Celsius to Fahrenheit?", a: "The formula is °F = (°C × 9/5) + 32. Select the Temperature category, choose Celsius and Fahrenheit. Key points: 0°C = 32°F (freezing), 100°C = 212°F (boiling), -40°C = -40°F (crossover)." },
  { q: "How precise are the conversions?", a: "Results are shown to 7 significant figures, which is accurate enough for virtually all practical purposes. Very large or very small numbers are shown in scientific notation." },
  { q: "Can I convert in both directions?", a: "Yes. Use the swap button (⇅) between the From and To selectors to instantly reverse the conversion direction." },
];

const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: "Unit Converter", url: `${siteUrl}/unit-converter`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free online unit converter for length (km/miles), weight (kg/lbs), temperature (°C/°F/K), speed, area, and volume." },
  { "@context": "https://schema.org", "@type": "HowTo", name: "How to convert units online", step: [{ "@type": "HowToStep", position: 1, name: "Select a category", text: "Click a category tab: Length, Weight, Temperature, Speed, Area, or Volume." }, { "@type": "HowToStep", position: 2, name: "Choose units and enter a value", text: "Select the From and To units, then enter your value. The result appears instantly." }, { "@type": "HowToStep", position: 3, name: "View all conversions", text: "Scroll down to see the value converted to all other units in the same category at once." }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Unit Converter", item: `${siteUrl}/unit-converter` }] },
];

export default function UnitConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Unit Converter</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">Convert length, weight, temperature, speed, area, and volume between metric and imperial units.</p>
        </div>
      </section>
      <UnitConverterClient />
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
      <RelatedTools current="unit-converter" />
    </>
  );
}
