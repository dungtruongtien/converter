import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SidebarAds } from "@/components/sidebar-ads";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://gadify.app";
const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID ?? "ca-pub-5200581180131547";
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gadify — Free Online Tools",
    template: "%s | Gadify",
  },
  description:
    "Free online tools: PDF to HTML converter, HTML to PDF converter, Instagram photo & Reels downloader, Facebook video downloader, Twitter/X video downloader. No signup required.",
  keywords: [
    "free online tools",
    "pdf to html",
    "html to pdf",
    "pdf converter",
    "instagram downloader",
    "instagram photo downloader",
    "instagram reels downloader",
    "facebook video downloader",
    "twitter video downloader",
    "x video downloader",
  ],
  authors: [{ name: "Gadify" }],
  creator: "Gadify",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Gadify",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fafafa] text-[#111827]">
        {gaId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Navbar />
        {/* <SidebarAds /> */}
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Tool links */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-3">Social Media Tools</p>
                <ul className="space-y-1.5">
                  <li><a href="/instagram-photo-downloader" className="text-sm text-gray-500 hover:text-gray-900">Instagram Photo Downloader</a></li>
                  <li><a href="/instagram-reel-downloader" className="text-sm text-gray-500 hover:text-gray-900">Instagram Reels Downloader</a></li>
                  <li><a href="/facebook-video-downloader" className="text-sm text-gray-500 hover:text-gray-900">Facebook Video Downloader</a></li>
                  <li><a href="/twitter-video-downloader" className="text-sm text-gray-500 hover:text-gray-900">X / Twitter Video Downloader</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">PDF & Document Tools</p>
                <ul className="space-y-1.5">
                  <li><a href="/pdf-to-html" className="text-sm text-gray-500 hover:text-gray-900">PDF to HTML Converter</a></li>
                  <li><a href="/html-to-pdf" className="text-sm text-gray-500 hover:text-gray-900">HTML to PDF Converter</a></li>
                  <li><a href="/pdf-toolkit" className="text-sm text-gray-500 hover:text-gray-900">PDF Toolkit (Merge / Split)</a></li>
                  <li><a href="/image-tools" className="text-sm text-gray-500 hover:text-gray-900">Image Compressor &amp; Converter</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-3">Developer Utilities</p>
                <ul className="space-y-1.5">
                  <li><a href="/word-counter" className="text-sm text-gray-500 hover:text-gray-900">Word Counter</a></li>
                  <li><a href="/character-counter" className="text-sm text-gray-500 hover:text-gray-900">Character Counter</a></li>
                  <li><a href="/case-converter" className="text-sm text-gray-500 hover:text-gray-900">Case Converter</a></li>
                  <li><a href="/base64" className="text-sm text-gray-500 hover:text-gray-900">Base64 Encode / Decode</a></li>
                  <li><a href="/url-encode" className="text-sm text-gray-500 hover:text-gray-900">URL Encode / Decode</a></li>
                  <li><a href="/cron-generator" className="text-sm text-gray-500 hover:text-gray-900">Cron Generator</a></li>
                  <li><a href="/timestamp-converter" className="text-sm text-gray-500 hover:text-gray-900">Timestamp Converter</a></li>
                  <li><a href="/unit-converter" className="text-sm text-gray-500 hover:text-gray-900">Unit Converter</a></li>
                  <li><a href="/percentage-calculator" className="text-sm text-gray-500 hover:text-gray-900">Percentage Calculator</a></li>
                  <li><a href="/loan-calculator" className="text-sm text-gray-500 hover:text-gray-900">Loan & Mortgage Calculator</a></li>
                  <li><a href="/spin-wheel" className="text-sm text-gray-500 hover:text-gray-900">Spin the Wheel</a></li>
                  <li><a href="/random-picker" className="text-sm text-gray-500 hover:text-gray-900">Random Picker</a></li>
                  <li><a href="/qr-code" className="text-sm text-gray-500 hover:text-gray-900">QR Code Generator</a></li>
                </ul>
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mt-5 mb-3">Visualization</p>
                <ul className="space-y-1.5">
                  <li><a href="/mindmap" className="text-sm text-gray-500 hover:text-gray-900">Mind Map Maker</a></li>
                </ul>
              </div>
            </div>
            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 border-t border-gray-100 pt-6">
              <p>© {new Date().getFullYear()} Gadify. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="/privacy" className="hover:text-gray-700">Privacy</a>
                <a href="/terms" className="hover:text-gray-700">Terms</a>
                <a href="/sitemap.xml" className="hover:text-gray-700">Sitemap</a>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              Gadify is not affiliated with Instagram, Facebook, Meta Platforms, X Corp, or Adobe. This tool only accesses publicly available content.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
