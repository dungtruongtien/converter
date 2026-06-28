import type { Metadata } from 'next'
import TabNav from '@/components/TabNav'
import AppClient from '@/components/AppClient'
import { RelatedTools } from '@/components/related-tools'

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gadify.app'

export const metadata: Metadata = {
  title: 'Instagram Photo Downloader – Download Instagram Photos Free',
  description:
    'Download full-resolution Instagram photos for free with Gadify. Save photos from any public Instagram post instantly — no login, no watermark, no app required.',
  keywords: [
    'instagram photo downloader',
    'download instagram photos',
    'save instagram photos',
    'instagram image downloader',
    'instagram downloader',
    'download photos from instagram',
    'instagram picture saver',
    'download ig photos',
    'save instagram post',
    'instagram photo grabber',
    'instagram image saver',
    'ig photo downloader',
  ],
  alternates: {
    canonical: '/instagram-photo-downloader',
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/instagram-photo-downloader`,
    siteName: 'Gadify',
    title: 'Instagram Photo Downloader – Download Instagram Photos Free',
    description:
      'Download full-resolution photos from any public Instagram post for free. No login, no watermark, no app required.',
    locale: 'en_US',
    images: [
      {
        url: `${siteUrl}/instagram-photo-downloader/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Instagram Photo Downloader – Download Instagram Photos Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Photo Downloader – Download Instagram Photos Free',
    description:
      'Download full-resolution photos from any public Instagram post for free. No login, no watermark, no app required.',
    images: [`${siteUrl}/instagram-photo-downloader/opengraph-image`],
  },
}

const faqs = [
  {
    q: 'Does Gadify work on private Instagram accounts?',
    a: 'No. Gadify only works with public Instagram posts. Private accounts require authentication and their content cannot be accessed without the account owner\'s permission.',
  },
  {
    q: 'Do I need an Instagram account to download photos?',
    a: 'No. You can download photos from any public Instagram post without logging in to Instagram or creating an account on Gadify. Simply paste the post URL and download.',
  },
  {
    q: 'Are the downloaded Instagram photos full resolution?',
    a: 'Yes. Gadify retrieves the highest-resolution version of each photo directly from Instagram\'s CDN servers. You get the same quality as the original upload — no compression, no watermark.',
  },
  {
    q: 'Is there a limit to how many Instagram photos I can download?',
    a: 'There is no daily download limit on Gadify. You can download as many public Instagram photos as you need, completely free of charge.',
  },
  {
    q: 'Why do I need to complete a human verification?',
    a: 'The quick CAPTCHA verification step prevents automated bots from abusing the service. This keeps Gadify free and fast for all real users.',
  },
  {
    q: 'How long is the image link valid after it is revealed?',
    a: 'Instagram CDN links are time-limited by design. We recommend saving the image immediately after it is revealed, as the link may expire within a few hours.',
  },
  {
    q: 'Which Instagram post URLs are supported?',
    a: 'Any URL in the format instagram.com/p/XXXXX/ pointing to a public photo post is supported. Multi-image carousel posts, Reels, and Stories are not currently supported.',
  },
  {
    q: 'Is it safe to use Gadify to download Instagram photos?',
    a: 'Yes. Gadify never asks for your Instagram login, password, or personal information. We only access publicly available image URLs from Instagram\'s own servers.',
  },
  {
    q: 'Can I download Instagram photos on my iPhone or Android?',
    a: 'Yes. Gadify works on all devices including iPhone, Android, Windows, and Mac — no app installation needed. Just open gadify.app in any mobile browser.',
  },
  {
    q: 'Does Gadify add a watermark to downloaded photos?',
    a: 'No. Gadify downloads the original photo directly from Instagram with no modifications, no watermark, and no branding added.',
  },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Gadify – Instagram Photo Downloader',
    url: `${siteUrl}/instagram-photo-downloader`,
    description: 'Free online Instagram photo downloader. Download full-resolution photos from any public Instagram post — no login, no watermark, no app required.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'Download Instagram photos for free',
      'Full-resolution photo download',
      'No login or Instagram account required',
      'No watermark on downloaded photos',
      'Works on mobile and desktop',
      'No download limit',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Download Instagram Photos',
    description: 'Download any public Instagram photo in 3 simple steps using Gadify.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Copy the Instagram Post URL',
        text: 'Open Instagram, find the public post you want to download, tap the three-dot menu and select "Copy Link", or copy the URL from your browser address bar.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Paste the URL into Gadify',
        text: 'Go to gadify.app/instagram-photo-downloader, paste the Instagram post URL into the input field, and click the Fetch button.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Complete Verification and Download',
        text: 'Complete the quick human verification, then click "Download Image" to save the full-resolution photo to your device.',
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
      { '@type': 'ListItem', position: 2, name: 'Instagram Photo Downloader', item: `${siteUrl}/instagram-photo-downloader` },
    ],
  },
]

export default function InstaPhotoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="mx-auto max-w-5xl px-4 py-8">

          {/* Header */}
          <header className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg mb-4" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Instagram Photo Downloader</h1>
            <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto">
              Download full-resolution photos from any public Instagram post — free, no login, no watermark, no app required.
            </p>
          </header>

          {/* Intro */}
          <section className="max-w-2xl mx-auto mb-8 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">
              Gadify is a free online Instagram photo downloader that lets you save full-resolution pictures from any public Instagram post directly to your device.
              Instagram does not provide a built-in download button, which makes it difficult to save photos you want to keep.
              Gadify solves this by letting you paste the post URL, complete a quick verification, and download the original-quality photo instantly — with no account, no app, and no watermark.
            </p>
          </section>

          {/* Tab navigation */}
          <TabNav active="photo" />

          {/* Interactive app */}
          <AppClient siteKey={siteKey} />

          <p className="mt-4 text-center text-xs text-gray-600">
            Only public Instagram posts are supported. Photos from private accounts cannot be accessed.
          </p>

          {/* How to download — general */}
          <section className="mt-16 max-w-2xl md:max-w-4xl mx-auto" aria-labelledby="how-to-download">
            <h2 id="how-to-download" className="text-xl font-bold text-gray-900 mb-4 text-center">How to Download Instagram Photos</h2>
            <p className="text-sm text-gray-700 text-center mb-6">
              Downloading photos from any public Instagram post takes only a few seconds. Follow these three steps to save any Instagram photo to your device for free.
            </p>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Copy the Instagram Post Link',
                  body: 'Open Instagram and find the public post. Tap the three-dot (⋯) menu on the post and select "Copy Link", or copy the URL directly from your browser address bar.',
                },
                {
                  step: '2',
                  title: 'Paste the URL & Click Fetch',
                  body: 'Paste the copied Instagram post URL into the input field above and click the Fetch button. Gadify will retrieve the photo information instantly.',
                },
                {
                  step: '3',
                  title: 'Verify & Download',
                  body: 'Complete the quick human verification, then click "Download Image" to save the full-resolution photo directly to your device with no watermark.',
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

          {/* How to download on Mobile */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="download-mobile">
            <h2 id="download-mobile" className="text-xl font-bold text-gray-900 mb-3">How to Download Instagram Photos on Mobile</h2>
            <p className="text-sm text-gray-700 mb-4">
              Gadify works on all smartphones — iPhone, Android, or any other device with a browser. No app installation is required. Here is how to download Instagram photos on mobile:
            </p>
            <ol className="space-y-3">
              {[
                'Open the Instagram app on your phone and navigate to the public post you want to download.',
                'Tap the three-dot menu (⋯) at the top-right corner of the post and select <strong>Copy Link</strong>.',
                'Open any browser on your phone (Chrome, Safari, Firefox) and go to <strong>gadify.app/instagram-photo-downloader</strong>.',
                'Paste the copied link into the input field and tap <strong>Fetch</strong>.',
                'Complete the quick verification, then tap <strong>Download Image</strong> to save the photo to your phone\'s camera roll or downloads folder.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-xs mt-0.5">{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: step }} />
                </li>
              ))}
            </ol>
          </section>

          {/* How to download on PC */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="download-pc">
            <h2 id="download-pc" className="text-xl font-bold text-gray-900 mb-3">How to Download Instagram Photos on PC</h2>
            <p className="text-sm text-gray-700 mb-4">
              Downloading Instagram photos on a Windows or Mac computer is even easier. You can copy the post URL directly from the browser address bar without needing the Instagram app:
            </p>
            <ol className="space-y-3">
              {[
                'Open your browser and go to <strong>instagram.com</strong>. Navigate to the public post you want to download.',
                'Copy the URL from the browser address bar (e.g. <em>instagram.com/p/XXXXXX/</em>).',
                'Open a new tab and go to <strong>gadify.app/instagram-photo-downloader</strong>.',
                'Paste the Instagram post URL into the input field and click <strong>Fetch</strong>.',
                'Complete the CAPTCHA verification, then click <strong>Download Image</strong>. The photo will be saved to your Downloads folder at full resolution.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-xs mt-0.5">{i + 1}</span>
                  <span dangerouslySetInnerHTML={{ __html: step }} />
                </li>
              ))}
            </ol>
          </section>

          {/* Why use Gadify */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="why-instadown">
            <h2 id="why-instadown" className="text-xl font-bold text-gray-900 mb-3">Why Use Gadify to Download Instagram Photos?</h2>
            <p className="text-sm text-gray-700 mb-4">
              There are many Instagram photo downloaders available online, but Gadify stands out for its simplicity, safety, and quality. Here is what makes Gadify the best free Instagram photo downloader:
            </p>
            <ul className="space-y-3">
              {[
                { title: 'Full Original Resolution', body: 'Gadify downloads the highest-quality version of each photo directly from Instagram\'s servers — the same resolution as the original upload, not a compressed screenshot.' },
                { title: 'No Watermark', body: 'Downloaded photos are completely clean with no Gadify logo, watermark, or branding added. You get the original photo exactly as the creator posted it.' },
                { title: 'No Login Required', body: 'Gadify never asks for your Instagram username or password. You do not need to create an account or connect any social media profiles to use the tool.' },
                { title: 'Works on All Devices', body: 'Gadify is a web-based tool that works directly in your browser on iPhone, Android, Windows, Mac, and any device with internet access.' },
                { title: 'Completely Free', body: 'Gadify is 100% free to use with no hidden fees, no premium plans, and no download limits. Download as many public Instagram photos as you need.' },
                { title: 'Fast and Secure', body: 'Gadify only accesses publicly available image URLs. No data is stored on our servers and the process is completed instantly in your browser.' },
              ].map(({ title, body }) => (
                <li key={title} className="flex gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <span className="flex-shrink-0 text-green-500 font-bold text-base mt-0.5">✓</span>
                  <span className="text-sm text-gray-700"><strong className="text-gray-900">{title}:</strong> {body}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Limitations / private accounts */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="limitations">
            <h2 id="limitations" className="text-xl font-bold text-gray-900 mb-3">Can You Download Private Instagram Photos?</h2>
            <p className="text-sm text-gray-700 mb-3">
              No. Gadify can only download photos from <strong>public Instagram accounts</strong>. If a profile is set to private, its posts are not accessible to anyone who does not follow that account, and Gadify cannot bypass this restriction.
            </p>
            <p className="text-sm text-gray-700 mb-3">
              This is by design — Gadify only accesses data that Instagram makes publicly available. Attempting to download content from private accounts would violate Instagram&apos;s Terms of Service and user privacy.
            </p>
            <p className="text-sm text-gray-700">
              If the post URL you enter belongs to a private account, Gadify will display an error. To download the photo, the account owner would need to switch their profile to public first.
            </p>
          </section>

          {/* Safety section */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="is-it-safe">
            <h2 id="is-it-safe" className="text-xl font-bold text-gray-900 mb-3">Is It Safe to Download Instagram Photos with Gadify?</h2>
            <p className="text-sm text-gray-700 mb-3">
              Yes, Gadify is completely safe to use. We never request your Instagram credentials, access your account, or store any personal information on our servers.
            </p>
            <p className="text-sm text-gray-700">
              Gadify is a read-only tool — it only retrieves the publicly accessible image URL from an Instagram post and proxies it to your browser for download. No data is written to Instagram and no information about you is collected or stored. The tool is safe to use on any device.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-700 text-center mb-6">
              Everything you need to know about downloading Instagram photos with Gadify.
            </p>
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
          <section className="mt-12 max-w-2xl mx-auto" aria-labelledby="related-tools">
            <h2 id="related-tools" className="text-xl font-bold text-gray-900 mb-4 text-center">More Free Download Tools</h2>
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
              <a href="/sitemap.xml" className="hover:text-gray-700">Sitemap</a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">Instagram</a>
            </nav>
            <p className="text-center text-xs text-gray-500">Gadify is not affiliated with Instagram or Meta Platforms, Inc.</p>
            <p className="text-center text-xs text-gray-500 mt-1">This tool only accesses publicly available content in accordance with Instagram&apos;s public data policies.</p>
          </footer>

        </div>
      </main>
      <RelatedTools current="instagram-photo-downloader" />
    </>
  )
}
