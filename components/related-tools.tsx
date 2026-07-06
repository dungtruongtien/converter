import Link from "next/link";

type ToolId =
  | "pdf-to-html"
  | "html-to-pdf"
  | "pdf-toolkit"
  | "image-tools"
  | "qr-code"
  | "instagram-photo-downloader"
  | "instagram-reel-downloader"
  | "facebook-video-downloader"
  | "twitter-video-downloader"
  | "word-counter"
  | "character-counter"
  | "case-converter"
  | "base64"
  | "url-encode"
  | "cron-generator"
  | "timestamp-converter"
  | "unit-converter"
  | "percentage-calculator"
  | "loan-calculator"
  | "spin-wheel"
  | "random-picker"
  | "mindmap";

interface Tool {
  id: ToolId;
  title: string;
  description: string;
  href: string;
  color: "purple" | "blue" | "green";
  icon: React.ReactNode;
}

const ALL_TOOLS: Tool[] = [
  {
    id: "pdf-to-html",
    title: "PDF → HTML Converter",
    description: "Convert any PDF into clean, responsive HTML in seconds.",
    href: "/pdf-to-html",
    color: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "html-to-pdf",
    title: "HTML → PDF Converter",
    description: "Turn any HTML into a pixel-perfect PDF for print or sharing.",
    href: "/html-to-pdf",
    color: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "pdf-toolkit",
    title: "PDF Toolkit",
    description: "Merge multiple PDFs, split by page range, or compress PDF files — all in your browser.",
    href: "/pdf-toolkit",
    color: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: "image-tools",
    title: "Image Compressor & Converter",
    description: "Compress, convert, and resize images — JPEG, PNG, WebP — all in your browser.",
    href: "/image-tools",
    color: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: "qr-code",
    title: "QR Code Generator",
    description: "Generate QR codes for URLs, Wi-Fi, contacts, VietQR payments, email, calendar, and more.",
    href: "/qr-code",
    color: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
      </svg>
    ),
  },
  {
    id: "instagram-photo-downloader",
    title: "Instagram Photo Downloader",
    description: "Save full-resolution Instagram photos — no login, no watermark.",
    href: "/instagram-photo-downloader",
    color: "purple",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "instagram-reel-downloader",
    title: "Instagram Reels Downloader",
    description: "Download Instagram Reels videos in full quality to any device.",
    href: "/instagram-reel-downloader",
    color: "purple",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "facebook-video-downloader",
    title: "Facebook Video Downloader",
    description: "Download Facebook Reels and videos for free — no account needed.",
    href: "/facebook-video-downloader",
    color: "purple",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "twitter-video-downloader",
    title: "X / Twitter Video Downloader",
    description: "Download videos from any public tweet with one click.",
    href: "/twitter-video-downloader",
    color: "purple",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, sentences, paragraphs, and reading time.",
    href: "/word-counter",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "character-counter",
    title: "Character Counter",
    description: "Count characters and check Twitter, SMS, and SEO limits.",
    href: "/character-counter",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    id: "case-converter",
    title: "Case Converter",
    description: "Convert text to UPPER, lower, camelCase, snake_case, and more.",
    href: "/case-converter",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  {
    id: "base64",
    title: "Base64 Encode / Decode",
    description: "Encode text to Base64 or decode Base64 strings. Supports Unicode.",
    href: "/base64",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "url-encode",
    title: "URL Encode / Decode",
    description: "Percent-encode strings for URLs or decode them back to text.",
    href: "/url-encode",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    id: "cron-generator",
    title: "Cron Expression Generator",
    description: "Build cron schedules visually with plain-English descriptions.",
    href: "/cron-generator",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert Unix timestamps to dates or dates to Unix epoch time.",
    href: "/timestamp-converter",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert length, weight, temperature, speed, area, and volume.",
    href: "/unit-converter",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    id: "percentage-calculator",
    title: "Percentage Calculator",
    description: "Calculate percentages in 5 modes: X% of Y, what % is X of Y, % change, add/subtract %.",
    href: "/percentage-calculator",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "loan-calculator",
    title: "Loan & Mortgage Calculator",
    description: "Calculate monthly payments, total interest, and see a full amortization schedule.",
    href: "/loan-calculator",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "spin-wheel",
    title: "Spin the Wheel",
    description: "Spin a customizable wheel to randomly pick a winner. Great for giveaways and decisions.",
    href: "/spin-wheel",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    id: "random-picker",
    title: "Random Picker",
    description: "Pick from a list, generate random numbers, flip a coin, roll dice, or draw cards.",
    href: "/random-picker",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: "mindmap",
    title: "Mind Map Maker",
    description: "Visual brainstorming in your browser. Pan, zoom, keyboard shortcuts. Export and import JSON.",
    href: "/mindmap",
    color: "purple",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
      </svg>
    ),
  },
];

interface RelatedToolsProps {
  /** The current tool's ID — excluded from the suggestions */
  current: ToolId;
  /** How many tools to show (default 3) */
  count?: number;
}

/**
 * Shows related tools for SEO cross-linking.
 * Prioritises tools from the other category, then fills from same category.
 */
export function RelatedTools({ current, count = 3 }: RelatedToolsProps) {
  const currentTool = ALL_TOOLS.find((t) => t.id === current)!;
  const otherCategory = ALL_TOOLS.filter(
    (t) => t.id !== current && t.color !== currentTool.color
  );
  const sameCategory = ALL_TOOLS.filter(
    (t) => t.id !== current && t.color === currentTool.color
  );

  // Fill: other-category first, then same-category
  const suggestions = [...otherCategory, ...sameCategory].slice(0, count);

  return (
    <section className="border-t border-gray-100 bg-gray-50" aria-labelledby="related-tools-heading">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 id="related-tools-heading" className="text-lg font-bold text-gray-900 mb-6">
          Other free tools you might need
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {suggestions.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className={`group flex gap-4 bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
                tool.color === "purple"
                  ? "border-gray-100 hover:border-purple-200"
                  : tool.color === "green"
                  ? "border-gray-100 hover:border-green-200"
                  : "border-gray-100 hover:border-blue-200"
              }`}
            >
              <div
                className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg text-white shadow-sm ${
                  tool.color === "purple"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : tool.color === "green"
                    ? "bg-gradient-to-br from-green-600 to-emerald-500"
                    : "bg-blue-600"
                }`}
              >
                {tool.icon}
              </div>
              <div className="min-w-0">
                <h3 className={`text-sm font-semibold mb-0.5 group-hover:underline ${
                  tool.color === "purple" ? "text-purple-700" : tool.color === "green" ? "text-green-700" : "text-blue-700"
                }`}>
                  {tool.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
