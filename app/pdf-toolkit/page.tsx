import type { Metadata } from "next";
import PdfToolkitClient from "@/components/PdfToolkitClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "PDF Toolkit — Merge, Split & Compress PDFs Free Online",
  description:
    "Merge multiple PDFs into one, split a PDF by page range, or compress a PDF to reduce file size — all free and 100% in your browser. No files are uploaded to any server.",
  keywords: [
    "merge pdf online",
    "split pdf online",
    "compress pdf online",
    "combine pdf files",
    "pdf splitter",
    "pdf compressor",
    "pdf merger free",
    "reduce pdf size",
    "pdf toolkit",
  ],
  alternates: { canonical: "/pdf-toolkit" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/pdf-toolkit`,
    siteName: "Gadify",
    title: "PDF Toolkit — Merge, Split & Compress PDFs Free Online",
    description: "Merge, split, and compress PDFs for free in your browser. No server upload.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Toolkit — Merge, Split & Compress PDFs Free",
    description: "Merge multiple PDFs, split by page range, or compress — all in your browser. Free.",
  },
};

const faqs = [
  {
    q: "Are my PDF files uploaded to a server?",
    a: "No. All PDF processing uses pdf-lib, a pure JavaScript library that runs entirely in your browser. Your files never leave your device.",
  },
  {
    q: "How many PDFs can I merge at once?",
    a: "There is no hard limit on the number of files. However, very large PDFs (100 MB+) may be slow to process since all operations run in the browser.",
  },
  {
    q: "Can I split a PDF into specific page ranges?",
    a: 'Yes. Enter ranges like "1-3, 4-6, 7" to create three separate PDFs. Leave the field empty to split every page into its own file.',
  },
  {
    q: "How much can PDF compression reduce file size?",
    a: "Results depend on the PDF. Non-optimised PDFs with lots of duplicate objects may shrink 10–40%. PDFs that are already optimised or consist mainly of scanned images will see minimal reduction.",
  },
  {
    q: "Does the order of PDFs matter when merging?",
    a: "Yes — pages are combined in the order files appear in the list. Use the up/down arrows to rearrange files before merging.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PDF Toolkit — Merge, Split & Compress",
    url: `${siteUrl}/pdf-toolkit`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free online PDF toolkit: merge multiple PDFs, split by page range, or compress to reduce file size. Runs entirely in the browser.",
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to merge, split, or compress a PDF online",
    step: [
      { "@type": "HowToStep", position: 1, name: "Choose a tool", text: "Select Merge, Split, or Compress from the tabs." },
      { "@type": "HowToStep", position: 2, name: "Upload your PDF(s)", text: "Drop one or more PDF files, or click to browse." },
      { "@type": "HowToStep", position: 3, name: "Configure options", text: "For Split: enter page ranges. For Merge: drag to reorder files." },
      { "@type": "HowToStep", position: 4, name: "Process and download", text: "Click the action button and download your result instantly." },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "PDF Toolkit", item: `${siteUrl}/pdf-toolkit` },
    ],
  },
];

export default function PdfToolkitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">PDF Toolkit</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Merge, split, and compress PDF files — free, instant, and 100% in your browser. No files are uploaded anywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["No upload", "Merge · Split · Compress", "Free forever"].map((tag) => (
              <span key={tag} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tool */}
      <PdfToolkitClient />

      {/* SEO content */}
      <section className="max-w-3xl mx-auto px-4 py-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Three PDF tools in one</h2>
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {[
            {
              title: "Merge PDFs",
              desc: "Combine multiple PDF files into a single document. Drag to reorder pages before merging.",
              icon: "🔗",
            },
            {
              title: "Split PDF",
              desc: "Extract specific page ranges into separate files, or split every page into its own PDF.",
              icon: "✂️",
            },
            {
              title: "Compress PDF",
              desc: "Reduce PDF file size using object stream compression — no quality loss on text and vectors.",
              icon: "📦",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

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

      <RelatedTools current="pdf-toolkit" />
    </>
  );
}
