import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";

export const metadata: Metadata = {
  title: "Gadify — Free Online Tools | PDF, Social Media & Developer Utilities",
  description:
    "14 free online tools in one place. Convert PDF to HTML, download Instagram & Facebook videos, count words, encode Base64, convert units, and more. No signup, no watermark.",
  keywords: [
    "free online tools",
    "pdf to html converter",
    "html to pdf converter",
    "instagram photo downloader",
    "instagram reels downloader",
    "facebook video downloader",
    "twitter video downloader",
    "word counter",
    "base64 encoder",
    "unit converter",
    "free developer tools",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Gadify",
    title: "Gadify — Free Online Tools",
    description:
      "PDF converter and social media downloader tools. Free, no signup, no watermark.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gadify — Free Online Tools",
    description:
      "PDF converter and social media downloader tools. Free, no signup, no watermark.",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gadify",
    url: siteUrl,
    description:
      "Free online tools: PDF to HTML converter, HTML to PDF converter, Instagram downloader, Facebook video downloader, Twitter video downloader.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/instagram-photo-downloader?url={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free Online Tools",
    description: "All tools available on Gadify",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "PDF to HTML Converter", url: `${siteUrl}/pdf-to-html` },
      { "@type": "ListItem", position: 2, name: "HTML to PDF Converter", url: `${siteUrl}/html-to-pdf` },
      { "@type": "ListItem", position: 3, name: "Instagram Photo Downloader", url: `${siteUrl}/instagram-photo-downloader` },
      { "@type": "ListItem", position: 4, name: "Instagram Reels Downloader", url: `${siteUrl}/instagram-reel-downloader` },
      { "@type": "ListItem", position: 5, name: "Facebook Video Downloader", url: `${siteUrl}/facebook-video-downloader` },
      { "@type": "ListItem", position: 6, name: "Twitter/X Video Downloader", url: `${siteUrl}/twitter-video-downloader` },
      { "@type": "ListItem", position: 7, name: "Word Counter", url: `${siteUrl}/word-counter` },
      { "@type": "ListItem", position: 8, name: "Character Counter", url: `${siteUrl}/character-counter` },
      { "@type": "ListItem", position: 9, name: "Case Converter", url: `${siteUrl}/case-converter` },
      { "@type": "ListItem", position: 10, name: "Base64 Encode / Decode", url: `${siteUrl}/base64` },
      { "@type": "ListItem", position: 11, name: "URL Encode / Decode", url: `${siteUrl}/url-encode` },
      { "@type": "ListItem", position: 12, name: "Cron Expression Generator", url: `${siteUrl}/cron-generator` },
      { "@type": "ListItem", position: 13, name: "Timestamp Converter", url: `${siteUrl}/timestamp-converter` },
      { "@type": "ListItem", position: 14, name: "Unit Converter", url: `${siteUrl}/unit-converter` },
    ],
  },
];

const socialTools = [
  {
    id: "photo",
    title: "Instagram Photo Downloader",
    description: "Download full-resolution photos from any public Instagram post. No compression, no watermark.",
    href: "/instagram-photo-downloader",
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    badge: "Most Popular",
  },
  {
    id: "reels",
    title: "Instagram Reels Downloader",
    description: "Save Instagram Reels in full quality to your device. Works on mobile and PC.",
    href: "/instagram-reel-downloader",
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: null,
  },
  {
    id: "facebook",
    title: "Facebook Video Downloader",
    description: "Download Facebook Reels and videos in full quality. Paste the link and save instantly.",
    href: "/facebook-video-downloader",
    icon: (
      <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    badge: null,
  },
  {
    id: "twitter",
    title: "X / Twitter Video Downloader",
    description: "Download videos from any public tweet in full quality. Works with x.com and twitter.com links.",
    href: "/twitter-video-downloader",
    icon: (
      <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    badge: "New",
  },
];

const pdfTools = [
  {
    id: "pdf-to-html",
    title: "PDF → HTML Converter",
    description: "Upload a PDF and receive a clean, responsive HTML file. Preserves layout, fonts, and images. Great for publishing documents to the web.",
    href: "/pdf-to-html",
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    badge: null,
  },
  {
    id: "html-to-pdf",
    title: "HTML → PDF Converter",
    description: "Paste HTML or upload a file and get a pixel-perfect PDF. Ideal for invoices, reports, and email templates.",
    href: "/html-to-pdf",
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    badge: null,
  },
];

const devTools = [
  { id: "word-counter", title: "Word Counter", description: "Words, chars, sentences, paragraphs, reading time.", href: "/word-counter", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { id: "character-counter", title: "Character Counter", description: "Count chars with Twitter, SMS, and SEO limit bars.", href: "/character-counter", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg> },
  { id: "case-converter", title: "Case Converter", description: "UPPER, lower, camelCase, snake_case, kebab-case & more.", href: "/case-converter", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> },
  { id: "base64", title: "Base64 Encode / Decode", description: "Encode text to Base64 or decode it back. Unicode safe.", href: "/base64", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { id: "url-encode", title: "URL Encode / Decode", description: "Percent-encode strings for URLs or decode them.", href: "/url-encode", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  { id: "cron-generator", title: "Cron Generator", description: "Build cron schedules visually with English descriptions.", href: "/cron-generator", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { id: "timestamp-converter", title: "Timestamp Converter", description: "Unix → date and date → Unix. UTC, ISO 8601, relative.", href: "/timestamp-converter", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { id: "unit-converter", title: "Unit Converter", description: "Length, weight, temperature, speed, area, and volume.", href: "/unit-converter", icon: <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg> },
];

const faqs = [
  {
    q: "Are all tools completely free?",
    a: "Yes. All 14 tools are free with no account required. The PDF converter offers an optional Pro plan for power users who need larger files and batch conversion.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. Every tool on Gadify works without any signup or login. Just open the tool and use it immediately.",
  },
  {
    q: "Is my data safe?",
    a: "The social media downloaders only access publicly available media URLs — we never request your login credentials. PDF files uploaded to the converter are automatically deleted within 1 hour.",
  },
  {
    q: "Do the tools work on mobile?",
    a: "Yes. All tools are fully responsive and work on iPhone, Android, and any device with a modern browser. No app installation required.",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            14 free tools — no signup required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Free Online Tools
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            PDF converter and social media downloader in one place.
            Fast, free, no watermark, no account.
          </p>
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <AdSlot slot="1234567890" format="leaderboard" className="max-w-[728px] mx-auto" />
      </div>

      {/* Social Media Tools */}
      <section className="max-w-5xl mx-auto px-4 py-12" aria-labelledby="social-tools-heading">
        <div className="flex items-center gap-3 mb-7">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <div>
            <h2 id="social-tools-heading" className="text-xl font-bold text-gray-900">Social Media Downloaders</h2>
            <p className="text-sm text-gray-500">Download photos and videos from Instagram, Facebook, and X/Twitter</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socialTools.map(({ id, title, description, href, icon, badge }) => (
            <Link
              key={id}
              href={href}
              className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all p-5"
            >
              {badge && (
                <span className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow mb-4">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
              <p className="text-xs text-gray-500 mb-4 flex-1">{description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 group-hover:gap-2 transition-all">
                Use tool
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PDF Tools */}
      <section className="max-w-5xl mx-auto px-4 pb-12" aria-labelledby="pdf-tools-heading">
        <div className="flex items-center gap-3 mb-7">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h2 id="pdf-tools-heading" className="text-xl font-bold text-gray-900">PDF & Document Tools</h2>
            <p className="text-sm text-gray-500">Convert between PDF and HTML formats instantly</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {pdfTools.map(({ id, title, description, href, icon, badge }) => (
            <Link
              key={id}
              href={href}
              className="group relative flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-6"
            >
              {badge && (
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 shadow">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 mb-4">{description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  Convert now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          ✓ No account required &nbsp;·&nbsp; ✓ Up to 10 MB free &nbsp;·&nbsp; ✓ 3 conversions/day free
        </p>
      </section>

      {/* Developer Utility Tools */}
      <section className="max-w-5xl mx-auto px-4 pb-12" aria-labelledby="dev-tools-heading">
        <div className="flex items-center gap-3 mb-7">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 id="dev-tools-heading" className="text-xl font-bold text-gray-900">Developer Utilities</h2>
            <p className="text-sm text-gray-500">Text processing, encoding, scheduling, and conversion tools</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {devTools.map(({ id, title, description, href, icon }) => (
            <Link
              key={id}
              href={href}
              className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all p-5"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
              <p className="text-xs text-gray-500 mb-4 flex-1">{description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 group-hover:gap-2 transition-all">
                Use tool
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-6xl mx-auto px-4 py-2">
        <AdSlot slot="0987654321" format="leaderboard" className="max-w-[728px] mx-auto" />
      </div>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-14 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How every tool works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: "1", label: "Pick a tool", desc: "Choose the right tool for your task — social media downloader or document converter." },
            { step: "2", label: "Paste or upload", desc: "Paste a URL for social media tools, or drag & drop your PDF or HTML file." },
            { step: "3", label: "Download instantly", desc: "Your file or media downloads in seconds. No waiting, no email, no account." },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900">{item.label}</h3>
              <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
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

      {/* Pro upsell */}
      <section className="max-w-5xl mx-auto px-4 py-14 text-center border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Need more from the PDF converter?</h2>
        <p className="text-gray-500 mb-6">
          Upgrade to Pro for larger files, unlimited conversions, batch convert, and API access.
        </p>
        <Link
          href="/pricing"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          View Pro plans — from $4.99/mo
        </Link>
      </section>
    </>
  );
}
