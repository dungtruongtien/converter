import type { Metadata } from "next";
import ImageToolsClient from "@/components/ImageToolsClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Image Compressor, Converter & Resizer — Free Online Tool",
  description:
    "Compress, convert, and resize images for free — directly in your browser. Reduce JPEG/PNG/WebP file size, convert between formats, or resize to exact dimensions. No upload to any server.",
  keywords: [
    "image compressor",
    "image converter",
    "image resizer",
    "compress jpeg online",
    "compress png online",
    "convert image to webp",
    "resize image free",
    "reduce image file size",
    "image optimizer",
  ],
  alternates: { canonical: "/image-tools" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/image-tools`,
    siteName: "Gadify",
    title: "Image Compressor, Converter & Resizer — Free Online Tool",
    description: "Compress, convert, and resize images in your browser. No server upload. Supports JPEG, PNG, WebP.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor, Converter & Resizer — Free",
    description: "Compress JPEG/PNG/WebP, convert image formats, or resize images — all in your browser.",
  },
};

const faqs = [
  {
    q: "Does this tool upload my images to a server?",
    a: "No. All processing happens entirely in your browser using the Canvas API. Your images never leave your device.",
  },
  {
    q: "What image formats are supported?",
    a: "You can input JPEG, PNG, WebP, GIF, BMP, and most other common image formats. Output formats are JPEG, PNG, and WebP.",
  },
  {
    q: "How does image compression work?",
    a: "The Compress tab re-encodes your image as JPEG with a lower quality setting (10–100%). Lower quality = smaller file. For lossless compression of PNG files, use the Convert tab and choose PNG.",
  },
  {
    q: "Why is WebP better than JPEG?",
    a: "WebP typically achieves 25–35% smaller file sizes than JPEG at the same visual quality. It also supports transparency like PNG. Most modern browsers fully support WebP.",
  },
  {
    q: "Will resizing an image lose quality?",
    a: "Making an image smaller (downscaling) has minimal quality impact. Making it larger (upscaling) will reduce sharpness since the browser cannot add detail that was not in the original.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Compressor, Converter & Resizer",
    url: `${siteUrl}/image-tools`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free online image compressor, converter, and resizer. Runs entirely in the browser — no server upload.",
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to compress, convert or resize an image online",
    step: [
      { "@type": "HowToStep", position: 1, name: "Choose a tool", text: "Select Compress, Convert Format, or Resize from the tabs." },
      { "@type": "HowToStep", position: 2, name: "Upload your image", text: "Drop an image or click to browse. Supports JPEG, PNG, WebP, and more." },
      { "@type": "HowToStep", position: 3, name: "Adjust settings", text: "Set quality level, output format, or target dimensions." },
      { "@type": "HowToStep", position: 4, name: "Download", text: "Click the action button and download your processed image instantly." },
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
      { "@type": "ListItem", position: 2, name: "Image Tools", item: `${siteUrl}/image-tools` },
    ],
  },
];

export default function ImageToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Image Tools</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Compress, convert, and resize images — free, instant, and 100% in your browser. No files are uploaded anywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["No upload", "JPEG · PNG · WebP", "Free forever"].map((tag) => (
              <span key={tag} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tool */}
      <ImageToolsClient />

      {/* SEO content */}
      <section className="max-w-3xl mx-auto px-4 py-12 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Three tools in one</h2>
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {[
            {
              title: "Compress",
              desc: "Reduce file size for faster web pages and email. Adjust quality to balance size and sharpness.",
              icon: "📦",
            },
            {
              title: "Convert Format",
              desc: "Convert JPEG to WebP for 30% better compression, or PNG for lossless quality with transparency.",
              icon: "🔄",
            },
            {
              title: "Resize",
              desc: "Set exact pixel dimensions for social media, thumbnails, or any target resolution.",
              icon: "📐",
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

      <RelatedTools current="image-tools" />
    </>
  );
}
