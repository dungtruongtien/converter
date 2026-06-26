import type { Metadata } from 'next'
import { RelatedTools } from '@/components/related-tools'
import TabNav from '@/components/TabNav'
import TwitterClient from '@/components/TwitterClient'
import AdUnit from '@/components/AdUnit'

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolfree.app'

export const metadata: Metadata = {
  title: 'X / Twitter Video Downloader – Download Twitter Videos Free Online',
  description:
    'Download X / Twitter videos for free with ToolFree. Save full-quality videos from any public tweet instantly — no login, no watermark, no app required.',
  keywords: [
    'twitter video downloader',
    'x video downloader',
    'download twitter video',
    'save twitter video',
    'twitter video download',
    'x twitter video downloader',
    'download video from twitter',
    'twitter video downloader online',
    'tweet video downloader',
    'download x video',
    'twitter mp4 downloader',
    'save tweet video',
  ],
  alternates: {
    canonical: '/twitter-video-downloader',
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/twitter-video-downloader`,
    siteName: 'ToolFree',
    title: 'X / Twitter Video Downloader – Download Twitter Videos Free Online',
    description:
      'Download full-quality X / Twitter videos from any public tweet for free. No login, no watermark, no app required.',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/twitter-video-downloader/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'X / Twitter Video Downloader – Download Twitter Videos Free Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'X / Twitter Video Downloader – Download Twitter Videos Free Online',
    description:
      'Download full-quality X / Twitter videos from any public tweet for free. No login, no watermark, no app required.',
    images: [`${siteUrl}/twitter-video-downloader/opengraph-image`],
  },
}

const faqs = [
  {
    q: 'Can I download Twitter / X videos without an account?',
    a: 'Yes. ToolFree lets you download videos from any public tweet without logging in or creating an account.',
  },
  {
    q: 'Are downloaded Twitter videos in full quality?',
    a: 'Yes. ToolFree retrieves the highest-quality MP4 version of the video directly from Twitter\'s CDN — no compression or watermark added.',
  },
  {
    q: 'Does ToolFree work on private Twitter accounts?',
    a: 'No. ToolFree only works with videos from public tweets. Videos on protected or private accounts cannot be accessed without the owner\'s permission.',
  },
  {
    q: 'Can I download Twitter videos on iPhone or Android?',
    a: 'Yes. ToolFree works on all devices — iPhone, Android, Windows, Mac — directly in the browser with no app installation needed.',
  },
  {
    q: 'Is it safe to use ToolFree to download Twitter videos?',
    a: 'Yes. ToolFree never asks for your Twitter / X login or password. It only accesses publicly available video URLs from Twitter\'s own servers.',
  },
  {
    q: 'What tweet URL formats are supported?',
    a: 'ToolFree supports both twitter.com and x.com URLs in the format: https://x.com/username/status/TWEET_ID',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ToolFree – X / Twitter Video Downloader',
    url: `${siteUrl}/twitter-video-downloader`,
    description: 'Free online X / Twitter video downloader. Download full-quality videos from any public tweet — no login, no watermark, no app required.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Download X / Twitter Videos',
    description: 'Download any public Twitter / X video in 3 simple steps using ToolFree.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Copy the Tweet URL',
        text: 'Open X / Twitter, find the public tweet with the video you want to download, tap the share icon and select "Copy link", or copy the URL from your browser address bar.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Paste the URL into ToolFree',
        text: 'Go to toolfree.app/twitter-video-downloader, paste the tweet URL into the input field, and click the Fetch button.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Complete Verification and Download',
        text: 'Complete the quick human verification, then click "Download" to save the full-quality video to your device.',
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
      { '@type': 'ListItem', position: 2, name: 'X / Twitter Video Downloader', item: `${siteUrl}/twitter-video-downloader` },
    ],
  },
]

export default function TwitterVideoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8">

          {/* Top leaderboard ad */}
          <div aria-label="Advertisement">
            <AdUnit slot="1234567890" format="horizontal" className="mb-6 rounded-xl bg-gray-100 min-h-[90px]" />
          </div>

          {/* Header */}
          <header className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black shadow-lg mb-4" aria-hidden="true">
              {/* X (Twitter) logo */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">X / Twitter Video Downloader</h1>
            <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto">
              Download full-quality videos from any public tweet — free, no login, no watermark, no app required.
            </p>
          </header>

          {/* Intro */}
          <section className="max-w-2xl mx-auto mb-8 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              ToolFree is a free online X / Twitter video downloader that lets you save videos from any public tweet directly to your device.
              X does not provide a built-in video download button, making it difficult to save content you want to keep offline.
              ToolFree solves this — paste the tweet URL, complete a quick verification, and download the original-quality video instantly with no account, no app, and no watermark.
            </p>
          </section>

          {/* Tab navigation */}
          <TabNav active="twitter" />

          {/* Interactive app */}
          <TwitterClient siteKey={siteKey} />

          <p className="mt-4 text-center text-xs text-gray-600">
            Only public tweets are supported. Videos from protected or private accounts cannot be accessed.
          </p>

          {/* How to download */}
          <section className="mt-16 max-w-2xl md:max-w-4xl mx-auto" aria-labelledby="how-to-download-twitter">
            <h2 id="how-to-download-twitter" className="text-xl font-bold text-gray-900 mb-4 text-center">How to Download X / Twitter Videos</h2>
            <p className="text-sm text-gray-700 text-center mb-6">
              Downloading any public Twitter video takes only a few seconds. Follow these three steps.
            </p>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Copy the Tweet Link',
                  body: 'Open X / Twitter and find the tweet with the video. Tap the share icon (↑) and select "Copy link", or copy the URL from your browser address bar.',
                },
                {
                  step: '2',
                  title: 'Paste the URL & Click Fetch',
                  body: 'Paste the copied tweet URL into the input field above and click Fetch. ToolFree will retrieve the video instantly.',
                },
                {
                  step: '3',
                  title: 'Verify & Download',
                  body: 'Complete the quick human verification, then click "Download" to save the full-quality video to your device with no watermark.',
                },
              ].map(({ step, title, body }) => (
                <li key={step} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white font-bold text-sm mb-3">{step}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-700">{body}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Why use ToolFree */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="why-instadown-twitter">
            <h2 id="why-instadown-twitter" className="text-xl font-bold text-gray-900 mb-3">Why Use ToolFree to Download Twitter Videos?</h2>
            <ul className="space-y-3">
              {[
                { title: 'Full Original Quality', body: 'ToolFree downloads the highest-quality MP4 version of each video directly from Twitter\'s CDN — no re-encoding, no compression, no watermark.' },
                { title: 'No Login Required', body: 'ToolFree never asks for your Twitter / X username or password. You do not need an account to use this tool.' },
                { title: 'Works on All Devices', body: 'ToolFree is a web-based tool that works on iPhone, Android, Windows, Mac, and any device with a browser — no app installation required.' },
                { title: 'Completely Free', body: 'ToolFree is 100% free with no hidden fees, no premium plans, and no download limits. Download as many public Twitter videos as you need.' },
              ].map(({ title, body }) => (
                <li key={title} className="flex gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="flex-shrink-0 text-green-500 font-bold text-base mt-0.5">✓</span>
                  <span className="text-sm text-gray-700"><strong className="text-gray-900">{title}:</strong> {body}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Safety section */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="twitter-safe">
            <h2 id="twitter-safe" className="text-xl font-bold text-gray-900 mb-3">Is It Safe to Download Twitter Videos with ToolFree?</h2>
            <p className="text-sm text-gray-700 mb-3">
              Yes, ToolFree is completely safe to use. We never request your Twitter / X credentials, access your account, or store any personal information on our servers.
            </p>
            <p className="text-sm text-gray-700">
              ToolFree only retrieves the publicly accessible video URL from a tweet and delivers it to your browser for download. No data is written to Twitter and no information about you is collected or stored.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="faq-twitter-heading">
            <h2 id="faq-twitter-heading" className="text-xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
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
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="related-tools-twitter">
            <h2 id="related-tools-twitter" className="text-xl font-bold text-gray-900 mb-4 text-center">More Free Download Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href="/instagram-reel-downloader" className="flex gap-3 items-start bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <span className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Instagram Reels Downloader</p>
                  <p className="text-xs text-gray-600 mt-0.5">Save Instagram Reels videos in full quality — free, no watermark.</p>
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
              <a href="/twitter-video-downloader" className="hover:text-gray-700">Twitter Video</a>
              <a href="/sitemap.xml" className="hover:text-gray-700">Sitemap</a>
            </nav>
            <p className="text-center text-xs text-gray-500">ToolFree is not affiliated with X Corp. or Twitter, Inc.</p>
            <p className="text-center text-xs text-gray-500 mt-1">This tool only accesses publicly available content in accordance with X&apos;s public data policies.</p>
          </footer>

        </div>
      </main>
      <RelatedTools current="twitter-video-downloader" />
    </>
  )
}
