# ToolFree — Project Reference

## Overview

Multi-tool free utility platform. Two original categories (PDF/document tools, social media downloaders) plus an expanding **Developer Utilities** category. All tools live under one Next.js app on one domain.

**Repo:** `Converter/converter/`  
**Domain target:** `toolfree.app` (configured via `NEXT_PUBLIC_APP_URL`)  
**Deployment:** Vercel (single project, all API routes included)

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 — strict mode |
| Styling | Tailwind CSS v4 (CSS-first config, no JS tailwind.config) |
| Fonts | Geist Sans (`--font-geist-sans`), Geist Mono (`--font-geist-mono`) — loaded via `next/font/google` |
| UI primitives | Custom components + lucide-react icons |
| PDF → HTML | `pdfjs-dist` |
| HTML → PDF | `puppeteer-core` + `@sparticuz/chromium` |
| File storage | `@vercel/blob` |
| Rate limiting | `@upstash/ratelimit` + `@upstash/redis` |
| Payments | Stripe |
| Analytics | `@vercel/analytics` |
| Ads | Google AdSense (injected in `layout.tsx` `<head>`) |
| Social scraping | `cheerio` + in-memory session store |
| CAPTCHA | `react-google-recaptcha` (social tools) |

---

## Color Theme

| Token | Value | Usage |
|---|---|---|
| Background | `#fafafa` | Page background (`bg-[#fafafa]`) |
| Foreground | `#111827` | Default text |
| Primary blue | `blue-600` (#2563eb) | PDF tools, buttons, links |
| Primary blue hover | `blue-700` | Button hover |
| Social purple | `purple-500` → `pink-500` gradient | Social media tools |
| Dev green | `green-600` → `emerald-500` gradient | Developer utility tools |
| Border | `gray-100` / `gray-200` | Cards, inputs |
| Muted text | `gray-500` | Subtitles, hints |
| Error | `red-50` bg + `red-200` border + `red-700` text | Error alerts |
| Success | `green-50` bg + `green-200` border + `green-700` text | Success states |

**Category color map:**
- Social tools → `from-purple-500 to-pink-500` gradient
- PDF/document tools → `bg-blue-600` solid
- Developer utilities → `from-green-600 to-emerald-500` gradient

---

## Typography

- **Font family:** Geist Sans (UI text), Geist Mono (code, textarea, monospace output)
- **Headings:** `font-bold`, sizes `text-2xl` (tool page h1) to `text-4xl` (homepage hero)
- **Body/desc:** `text-sm text-gray-500` or `text-gray-600`
- **Labels:** `text-xs font-semibold uppercase tracking-wide` (section category labels)
- **Code/mono content:** `font-mono text-sm` in textareas and output blocks

---

## Layout Structure

### Global (`app/layout.tsx`)
```
<html>
  <head> AdSense script </head>
  <body bg-[#fafafa]>
    <Navbar />           ← sticky top-0 z-50
    <main flex-1>        ← page content
    <footer>             ← 2-column tool links + bottom bar
    <Analytics />
  </body>
</html>
```

### Navbar (`components/navbar.tsx`)
- Sticky, `h-14`, white bg, `border-b border-gray-200`
- Logo left: gradient TF badge + "ToolFree"
- Desktop: hover dropdowns per category (Social Tools, PDF Tools, Dev Tools)
- Mobile: hamburger → full-width slide-down menu with category sections
- Active route highlighted with category color

### Homepage (`app/page.tsx`)
```
Hero (white bg, border-b)
AdSlot (leaderboard)
Section: Social Media Downloaders  (purple category header + 4-col grid)
Section: PDF & Document Tools      (blue category header + 2-col grid)
Section: Developer Utilities       (green category header + N-col grid)
AdSlot (leaderboard)
How it works (3 steps)
FAQ (4 items)
Pro upsell CTA
```

### Tool Page (client-side interactive utility)
```
<>                                   ← React fragment (no nested <main>)
  Hero banner (white bg, border-b)
    h1 + subtitle
  <ToolClient />                     ← "use client" component
    Input area (textarea/input)
    Options panel (if needed)
    Action button
    Output area (copy button)
  AdSlot
  How it works (3 steps)
  Features list
  FAQ (accordions or flat)
  <RelatedTools current="tool-id" />
</>
```

### Tool Page (server-side conversion — PDF tools)
```
<>
  Hero banner
  <ConverterForm mode="..." />       ← "use client" — file upload + options + progress
  <RelatedTools current="tool-id" />
</>
```

### Tool Page (social media downloader)
```
<>
  <script ld+json />
  <main bg-gradient-to-br from-purple-50>
    AdUnit (leaderboard)
    header (h1 + subtitle)
    intro paragraph
    <TabNav active="..." />
    <AppClient|ReelsClient|FacebookClient|TwitterClient siteKey={...} />
    How it works (3 steps)
    Features
    FAQ
    Footer nav
  </main>
  <RelatedTools current="tool-id" />
</>
```

---

## Coding Conventions

### File naming
- Pages: `app/[tool-slug]/page.tsx` — kebab-case slug matching the URL
- Client components: `components/[ToolName]Client.tsx` — PascalCase
- Shared UI: `components/[component-name].tsx` — kebab-case
- Lib/utils: `lib/[domain].ts` — kebab-case

### Component conventions
- Server components by default; add `"use client"` only when needed (hooks, browser APIs)
- Interactive tool UIs are always `"use client"` components in `/components/`
- Pages import client components — never make a page itself `"use client"` unless unavoidable
- Named exports for shared UI (`export function Navbar`), default exports for pages

### TypeScript
- Strict mode on — no `any` without explicit cast
- Interface for props, type for unions/primitives
- API routes use `NextRequest` / `NextResponse`

### Tailwind
- Tailwind v4 — no `tailwind.config.ts`, configured via `@theme inline {}` in `globals.css`
- Use Tailwind utilities directly; no CSS modules
- Responsive: mobile-first, `sm:` / `lg:` breakpoints
- Interactive states: `hover:`, `focus:ring-2 focus:ring-blue-500`, `active:scale-[0.99]`

### API Routes (`app/api/`)
- All in `route.ts` files with named HTTP method exports (`GET`, `POST`)
- Return `NextResponse.json(data)` or `NextResponse.json({ error }, { status: N })`
- Validate input at top of handler; return 400 for bad input
- Pure utility tools (word counter, base64, etc.) run entirely client-side — no API route needed

### Client-side utility tools (word counter, base64, etc.)
- All logic runs in the browser — no API route
- Use `useState` for input/output
- Debounce or compute on-change for instant feedback
- Copy-to-clipboard via `navigator.clipboard.writeText()`
- Show character/word counts in `text-xs text-gray-400` below textarea

### SEO conventions
- Every page exports `metadata` with `title`, `description`, `keywords`, `alternates.canonical`, `openGraph`, `twitter`
- Tool pages include JSON-LD (`WebApplication` + `HowTo` + `FAQPage` + `BreadcrumbList`)
- `app/sitemap.ts` lists all public routes with `priority` and `changeFrequency`
- `<RelatedTools current="tool-id" />` added to every tool page for internal linking

### Ad placements
- Use `<AdSlot />` (PDF tool style) or `<AdUnit />` (social tool style — `"use client"`)
- Standard slots: leaderboard above fold, rectangle in sidebar/below tool, leaderboard between sections

---

## Tool Categories & Routes

### Social Media Downloaders (purple)
| Tool | Route |
|---|---|
| Instagram Photo Downloader | `/instagram-photo-downloader` |
| Instagram Reels Downloader | `/instagram-reel-downloader` |
| Facebook Video Downloader | `/facebook-video-downloader` |
| X / Twitter Video Downloader | `/twitter-video-downloader` |

### PDF & Document Tools (blue)
| Tool | Route |
|---|---|
| PDF → HTML | `/pdf-to-html` |
| HTML → PDF | `/html-to-pdf` |

### Developer Utilities (green)
| Tool | Route |
|---|---|
| Word Counter | `/word-counter` |
| Character Counter | `/character-counter` |
| Case Converter | `/case-converter` |
| Base64 Encode/Decode | `/base64` |
| URL Encode/Decode | `/url-encode` |
| Cron Expression Generator | `/cron-generator` |
| Timestamp Converter | `/timestamp-converter` |
| Unit Converter | `/unit-converter` |

---

## Key Files Reference

| File | Purpose |
|---|---|
| `app/layout.tsx` | Root layout — navbar, footer, analytics, AdSense |
| `app/page.tsx` | Homepage — all tool categories |
| `app/globals.css` | Tailwind v4 import + CSS vars |
| `app/sitemap.ts` | Sitemap for all public routes |
| `components/navbar.tsx` | Sticky nav with category dropdowns |
| `components/related-tools.tsx` | SEO cross-linking widget |
| `components/ad-slot.tsx` | Server-compatible AdSense placeholder |
| `components/AdUnit.tsx` | Client-side AdSense push component |
| `components/converter-form.tsx` | PDF conversion UI |
| `lib/session-store.ts` | In-memory session TTL store (social tools) |
| `lib/rate-limit.ts` | Upstash rate limiter |
| `lib/storage.ts` | Vercel Blob helpers |

---

## Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://toolfree.app
NEXT_PUBLIC_SITE_URL=https://toolfree.app        # legacy alias
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET=...
BLOB_READ_WRITE_TOKEN=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
PUPPETEER_EXECUTABLE_PATH=                       # local dev only
```
