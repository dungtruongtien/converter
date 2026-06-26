# Implementation / Coding Skill

Use this skill when building a new tool page in ToolFree. Always run the planning skill first.

## Pre-flight checklist
- [ ] Read `PROJECT.md` for conventions
- [ ] Run `plan.md` skill to confirm spec
- [ ] Confirm no existing route conflict (`app/sitemap.ts`)

---

## Template: Developer Utility Tool

### `app/[slug]/page.tsx`

```tsx
import type { Metadata } from "next";
import { ToolNameClient } from "@/components/ToolNameClient";
import { RelatedTools } from "@/components/related-tools";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://toolfree.app";

export const metadata: Metadata = {
  title: "Tool Name — Free Online Tool",
  description: "150-160 char description with primary keyword.",
  keywords: ["keyword1", "keyword2"],
  alternates: { canonical: "/tool-slug" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/tool-slug`,
    siteName: "ToolFree",
    title: "Tool Name — Free Online Tool",
    description: "Short OG description.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tool Name — Free Online Tool",
    description: "Short Twitter description.",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tool Name",
    url: `${siteUrl}/tool-slug`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "...",
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use Tool Name",
    step: [
      { "@type": "HowToStep", position: 1, name: "Step 1", text: "..." },
      { "@type": "HowToStep", position: 2, name: "Step 2", text: "..." },
      { "@type": "HowToStep", position: 3, name: "Step 3", text: "..." },
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
      { "@type": "ListItem", position: 2, name: "Tool Name", item: `${siteUrl}/tool-slug` },
    ],
  },
];

const faqs = [
  { q: "Is this tool free?", a: "Yes, completely free, no signup required." },
  // 3-5 more relevant FAQs
];

export default function ToolNamePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 shadow mb-4">
            {/* SVG icon */}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Tool Name</h1>
          <p className="mt-2 text-gray-500 text-sm max-w-xl mx-auto">
            One-sentence description. Free, no signup.
          </p>
        </div>
      </section>
      <ToolNameClient />
      <RelatedTools current="tool-slug" />
    </>
  );
}
```

### `components/ToolNameClient.tsx`

```tsx
"use client";

import { useState } from "react";

export function ToolNameClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const process = (value: string) => {
    setInput(value);
    setOutput(/* transform value */);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
        <textarea
          value={input}
          onChange={(e) => process(e.target.value)}
          className="w-full h-40 rounded-xl border border-gray-200 p-4 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Paste your text here..."
        />
      </div>

      {/* Output */}
      {output && (
        <div className="relative rounded-xl border border-gray-200 bg-gray-50 p-4">
          <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">{output}</pre>
          <button
            onClick={copy}
            className="absolute top-3 right-3 text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Key rules

1. **No `"use client"` on page.tsx** — keep it a server component for metadata/SEO
2. **Copy button** — every tool with text output must have a clipboard copy button
3. **Instant feedback** — compute output in the `onChange` handler, not on button click
4. **Green ring on focus** — `focus:ring-green-500` for dev utility inputs
5. **Error states** — show inline error in `text-sm text-red-600` below input
6. **Empty state** — show a hint in the output area when input is empty
7. **RelatedTools** — always add `<RelatedTools current="tool-slug" />` at page bottom
8. **JSON-LD** — always include all 4 schemas (WebApplication, HowTo, FAQPage, BreadcrumbList)
9. **Run `npx tsc --noEmit`** after implementing — must produce zero errors

---

## Update checklist after adding a tool

- [ ] `app/page.tsx` — add card to Dev Utilities section
- [ ] `components/navbar.tsx` — add link to Dev Tools dropdown
- [ ] `app/sitemap.ts` — add `{ url: "/tool-slug", priority: 0.9, changeFrequency: "weekly" }`
- [ ] `components/related-tools.tsx` — add entry to `ALL_TOOLS` array with correct `color: "green"`
