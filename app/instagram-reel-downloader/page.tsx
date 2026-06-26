import type { Metadata } from 'next'
import { RelatedTools } from '@/components/related-tools'
import TabNav from '@/components/TabNav'
import ReelsClient from '@/components/ReelsClient'
import AdUnit from '@/components/AdUnit'

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gadify.app'

export const metadata: Metadata = {
  title: 'Instagram Reels Downloader – Download Reels Free Online',
  description:
    'Download Instagram Reels videos for free with Gadify. Save full-quality Reels from any public Instagram account instantly — no login, no watermark, no app required.',
  keywords: [
    'instagram reels downloader',
    'download instagram reels',
    'instagram reels video downloader',
    'save instagram reels',
    'instagram reel download',
    'download reels from instagram',
    'instagram reels downloader online',
    'instagram video downloader',
    'instagram reel saver',
    'save ig reels',
    'download instagram reels without watermark',
    'ig reels downloader',
  ],
  alternates: {
    canonical: '/instagram-reel-downloader',
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/instagram-reel-downloader`,
    siteName: 'Gadify',
    title: 'Instagram Reels Downloader – Download Reels Free Online',
    description:
      'Download full-quality Instagram Reels from any public account for free. No login, no watermark, no app required.',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/instagram-reel-downloader/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Instagram Reels Downloader – Download Reels Free Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Reels Downloader – Download Reels Free Online',
    description:
      'Download full-quality Instagram Reels from any public account for free. No login, no watermark, no app required.',
    images: [`${siteUrl}/instagram-reel-downloader/opengraph-image`],
  },
}

const faqs = [
  {
    q: 'Can I download Instagram Reels without an account?',
    a: 'Yes. Gadify lets you download Reels from any public Instagram account without logging in or creating an account.',
  },
  {
    q: 'Are downloaded Reels in full quality?',
    a: 'Yes. Gadify retrieves the highest-quality version of the Reel directly from Instagram\'s CDN — no compression or watermark added.',
  },
  {
    q: 'Does Gadify work on private Instagram accounts?',
    a: 'No. Gadify only works with public Instagram accounts. Reels from private accounts cannot be accessed without the owner\'s permission.',
  },
  {
    q: 'Can I download Instagram Reels on iPhone or Android?',
    a: 'Yes. Gadify works on all devices — iPhone, Android, Windows, Mac — directly in the browser with no app installation needed.',
  },
  {
    q: 'Is it safe to use Gadify to download Reels?',
    a: 'Yes. Gadify never asks for your Instagram login or password. It only accesses publicly available video URLs from Instagram\'s own servers.',
  },
  {
    q: 'Is there a limit to how many Reels I can download?',
    a: 'No. You can download as many public Instagram Reels as you need, completely free of charge.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Gadify – Instagram Reels Downloader',
    url: `${siteUrl}/instagram-reel-downloader`,
    description: 'Free online Instagram Reels downloader. Download full-quality Reels from any public Instagram account — no login, no watermark, no app required.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Download Instagram Reels',
    description: 'Download any public Instagram Reel in 3 simple steps using Gadify.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Copy the Instagram Reel URL',
        text: 'Open Instagram, find the public Reel you want to download, tap the three-dot menu and select "Copy Link", or copy the URL from your browser address bar.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Paste the URL into Gadify',
        text: 'Go to gadify.app/instagram-reel-downloader, paste the Reel URL into the input field, and click the Fetch button.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Complete Verification and Download',
        text: 'Complete the quick human verification, then click "Download Reel" to save the full-quality video to your device.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Instagram Reels Downloader', item: `${siteUrl}/instagram-reel-downloader` },
    ],
  },
]

export default function InstaReelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="mx-auto max-w-5xl px-4 py-8">

          {/* Top leaderboard ad */}
          <div aria-label="Advertisement">
            <AdUnit slot="1234567890" format="horizontal" className="mb-6 rounded-xl bg-gray-100 min-h-[90px]" />
          </div>

          {/* Header */}
          <header className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Instagram Reels Downloader</h1>
            <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto">
              Download full-quality Reels from any public Instagram account — free, no login, no watermark, no app required.
            </p>
          </header>

          {/* Intro */}
          <section className="max-w-2xl mx-auto mb-8 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              Gadify is a free online Instagram Reels downloader that lets you save videos from any public Reel directly to your device.
              Instagram does not provide a built-in download button for Reels, making it hard to save videos you want to keep.
              Gadify solves this — paste the Reel URL, complete a quick verification, and download the original-quality video instantly with no account, no app, and no watermark.
            </p>
          </section>

          {/* Tab navigation */}
          <TabNav active="reels" />

          {/* Interactive app */}
          <ReelsClient siteKey={siteKey} />

          <p className="mt-4 text-center text-xs text-gray-600">
            Only public Instagram Reels are supported. Videos from private accounts cannot be accessed.
          </p>

          {/* How to download */}
          <section className="mt-16 max-w-2xl md:max-w-4xl mx-auto" aria-labelledby="how-to-download-reels">
            <h2 id="how-to-download-reels" className="text-xl font-bold text-gray-900 mb-4 text-center">How to Download Instagram Reels</h2>
            <p className="text-sm text-gray-700 text-center mb-6">
              Downloading any public Instagram Reel takes only a few seconds. Follow these three steps.
            </p>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Copy the Reel Link',
                  body: 'Open Instagram and find the public Reel. Tap the three-dot (⋯) menu and select "Copy Link", or copy the URL directly from your browser address bar.',
                },
                {
                  step: '2',
                  title: 'Paste the URL & Click Fetch',
                  body: 'Paste the copied Reel URL into the input field above and click Fetch. Gadify will retrieve the video instantly.',
                },
                {
                  step: '3',
                  title: 'Verify & Download',
                  body: 'Complete the quick human verification, then click "Download Reel" to save the full-quality video to your device with no watermark.',
                },
              ].map(({ step, title, body }) => (
                <li key={step} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-sm mb-3">{step}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-700">{body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Why use Gadify */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="why-instadown-reels">
            <h2 id="why-instadown-reels" className="text-xl font-bold text-gray-900 mb-3">Why Use Gadify to Download Instagram Reels?</h2>
            <ul className="space-y-3">
              {[
                { title: 'Full Original Quality', body: 'Gadify downloads the highest-quality version of each Reel directly from Instagram\'s CDN servers — no re-encoding, no compression, no watermark.' },
                { title: 'No Login Required', body: 'Gadify never asks for your Instagram username or password. You do not need to create an account or connect any social media profile.' },
                { title: 'Works on All Devices', body: 'Gadify is a web-based tool that works on iPhone, Android, Windows, Mac, and any device with a browser — no app installation required.' },
                { title: 'Completely Free', body: 'Gadify is 100% free with no hidden fees, no premium plans, and no download limits. Download as many public Reels as you need.' },
              ].map(({ title, body }) => (
                <li key={title} className="flex gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="flex-shrink-0 text-green-500 font-bold text-base mt-0.5">✓</span>
                  <span className="text-sm text-gray-700"><strong className="text-gray-900">{title}:</strong> {body}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Safety section */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="reels-safe">
            <h2 id="reels-safe" className="text-xl font-bold text-gray-900 mb-3">Is It Safe to Download Instagram Reels with Gadify?</h2>
            <p className="text-sm text-gray-700 mb-3">
              Yes, Gadify is completely safe to use. We never request your Instagram credentials, access your account, or store any personal information on our servers.
            </p>
            <p className="text-sm text-gray-700">
              Gadify is a read-only tool — it only retrieves the publicly accessible video URL from an Instagram Reel and proxies it to your browser for download. No data is written to Instagram and no information about you is collected or stored.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">{q}</h3>
                  <p className="text-sm text-gray-700">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related tools */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="related-tools-reels">
            <h2 id="related-tools-reels" className="text-xl font-bold text-gray-900 mb-4 text-center">More Free Download Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href="/instagram-photo-downloader" className="flex gap-3 items-start bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <span className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Instagram Photo Downloader</p>
                  <p className="text-xs text-gray-600 mt-0.5">Download full-resolution Instagram photos for free, no login needed.</p>
                </div>
              </a>
              <a href="/facebook-video-downloader" className="flex gap-3 items-start bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <span className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Facebook Reels Downloader</p>
                  <p className="text-xs text-gray-600 mt-0.5">Download Facebook Reels in full quality for free, no login needed.</p>
                </div>
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 border-t border-gray-200 pt-6">
            <nav className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-3">
              <a href="/" className="hover:text-gray-700">Home</a>
              <a href="/instagram-photo-downloader" className="hover:text-gray-700">Instagram Photo</a>
              <a href="/instagram-reel-downloader" className="hover:text-gray-700">Instagram Reels</a>
              <a href="/facebook-video-downloader" className="hover:text-gray-700">Facebook Reels</a>
              <a href="/sitemap.xml" className="hover:text-gray-700">Sitemap</a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">Instagram</a>
            </nav>
            <p className="text-center text-xs text-gray-500">Gadify is not affiliated with Instagram or Meta Platforms, Inc.</p>
            <p className="text-center text-xs text-gray-500 mt-1">This tool only accesses publicly available content in accordance with Instagram&apos;s public data policies.</p>
          </footer>

        </div>
      </main>
      <RelatedTools current="instagram-reel-downloader" />
    </>
  )
}
