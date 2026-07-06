"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const socialTools = [
  { href: "/instagram-photo-downloader", label: "Instagram Photo" },
  { href: "/instagram-reel-downloader", label: "Instagram Reels" },
  { href: "/facebook-video-downloader", label: "Facebook Video" },
  { href: "/twitter-video-downloader", label: "X / Twitter Video" },
];

const pdfTools = [
  { href: "/pdf-to-html", label: "PDF → HTML" },
  { href: "/html-to-pdf", label: "HTML → PDF" },
  { href: "/pdf-toolkit", label: "PDF Toolkit (Merge / Split)" },
  { href: "/image-tools", label: "Image Compressor & Converter" },
];

const devToolsNav = [
  { href: "/word-counter", label: "Word Counter" },
  { href: "/character-counter", label: "Character Counter" },
  { href: "/case-converter", label: "Case Converter" },
  { href: "/base64", label: "Base64 Encode/Decode" },
  { href: "/url-encode", label: "URL Encode/Decode" },
  { href: "/cron-generator", label: "Cron Generator" },
  { href: "/timestamp-converter", label: "Timestamp Converter" },
  { href: "/unit-converter", label: "Unit Converter" },
  { href: "/percentage-calculator", label: "Percentage Calculator" },
  { href: "/loan-calculator", label: "Loan & Mortgage Calculator" },
  { href: "/spin-wheel", label: "Spin the Wheel" },
  { href: "/random-picker", label: "Random Picker" },
  { href: "/qr-code", label: "QR Code Generator" },
];

const vizToolsNav = [
  { href: "/mindmap", label: "Mind Map Maker" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [vizOpen, setVizOpen] = useState(false);
  const pathname = usePathname();

  const isSocial = socialTools.some((t) => pathname === t.href);
  const isPdf = pdfTools.some((t) => pathname === t.href);
  const isDev = devToolsNav.some((t) => pathname === t.href);
  const isViz = vizToolsNav.some((t) => pathname === t.href);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs font-bold">
            G
          </span>
          Gadify
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-600">
          {/* Social dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setSocialOpen(true)}
            onMouseLeave={() => setSocialOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium ${
                isSocial ? "text-purple-600" : "text-gray-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Social Tools
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {socialOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-50">
                {socialTools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-purple-700 transition-colors ${
                      pathname === t.href ? "text-purple-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* PDF dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPdfOpen(true)}
            onMouseLeave={() => setPdfOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium ${
                isPdf ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              PDF Tools
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {pdfOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-50">
                {pdfTools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                      pathname === t.href ? "text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Dev Tools dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDevOpen(true)}
            onMouseLeave={() => setDevOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium ${
                isDev ? "text-green-600" : "text-gray-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Dev Tools
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {devOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-50">
                {devToolsNav.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-green-50 hover:text-green-700 transition-colors ${
                      pathname === t.href ? "text-green-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Visualization dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setVizOpen(true)}
            onMouseLeave={() => setVizOpen(false)}
          >
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium ${
                isViz ? "text-violet-600" : "text-gray-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
              Visualization
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {vizOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-50">
                {vizToolsNav.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors ${
                      pathname === t.href ? "text-violet-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1 text-sm">
          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide px-2 py-1">Social Tools</p>
          {socialTools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors ${
                pathname === t.href ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </Link>
          ))}
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide px-2 py-1 mt-2">PDF Tools</p>
          {pdfTools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors ${
                pathname === t.href ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </Link>
          ))}
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide px-2 py-1 mt-2">Dev Tools</p>
          {devToolsNav.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors ${
                pathname === t.href ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </Link>
          ))}
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide px-2 py-1 mt-2">Visualization</p>
          {vizToolsNav.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg transition-colors ${
                pathname === t.href ? "bg-violet-50 text-violet-700 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
