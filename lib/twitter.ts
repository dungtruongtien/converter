import * as cheerio from 'cheerio'

export interface TwitterVideoMetadata {
  videoUrl: string
  thumbnailUrl: string
  title: string
  description: string
}

export function isValidTwitterUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      (parsed.hostname === 'twitter.com' || parsed.hostname === 'www.twitter.com' ||
       parsed.hostname === 'x.com' || parsed.hostname === 'www.x.com') &&
      /^\/\w+\/status\/\d+/.test(parsed.pathname)
    )
  } catch {
    return false
  }
}

function extractTweetId(url: string): string | null {
  const match = url.match(/\/status\/(\d+)/)
  return match ? match[1] : null
}

function computeSyndicationToken(tweetId: string): string {
  // Reverse-engineered from Twitter's embed JS
  const num = parseFloat(tweetId) / 1e15
  return (num * Math.PI).toString(36).replace(/(0+|\.)/g, '') || '0'
}

function decodeTwitterUrl(raw: string): string {
  const decoded = raw
    .replace(/\\\\/g, '\\')
    .replace(/\\\//g, '/')
    .replace(/\\u0026/gi, '&')
    .replaceAll('&amp;', '&')

  try {
    const parsed = new URL(decoded)
    parsed.pathname = parsed.pathname.replace(/\/\/+/g, '/')
    return parsed.toString()
  } catch {
    return decoded
  }
}

/** Strategy 1: Twitter Syndication API (used by Twitter's own embed widget) */
async function fetchViaSyndicationApi(tweetId: string): Promise<string> {
  const token = computeSyndicationToken(tweetId)
  const apiUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=${token}`

  const res = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Origin': 'https://platform.twitter.com',
      'Referer': 'https://platform.twitter.com/',
    },
  })

  if (!res.ok) return ''

  const data = await res.json()

  const mediaDetails: Array<{ video_info?: { variants: Array<{ content_type: string; url: string; bitrate?: number }> } }> =
    data?.mediaDetails ?? []

  for (const media of mediaDetails) {
    if (media?.video_info?.variants) {
      const mp4Variants = media.video_info.variants
        .filter((v) => v.content_type === 'video/mp4')
        .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))
      if (mp4Variants.length > 0) {
        return mp4Variants[0].url
      }
    }
  }

  return ''
}

/** Strategy 2: Crawler UA on tweet page → og:video + script JSON */
async function fetchViaPageScrape(tweetUrl: string): Promise<string> {
  const res = await fetch(tweetUrl, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uagent.php)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  })

  if (!res.ok) return ''

  const html = await res.text()
  const $ = cheerio.load(html)

  // Check og:video meta tags
  const ogVideo =
    $('meta[property="og:video:url"]').attr('content') ||
    $('meta[property="og:video:secure_url"]').attr('content') ||
    $('meta[property="og:video"]').attr('content') ||
    ''
  if (ogVideo && (ogVideo.includes('twimg.com') || ogVideo.includes('video.twitter.com'))) {
    return decodeTwitterUrl(ogVideo)
  }

  // Check script tags for video_url or playable_url
  let videoUrl = ''
  $('script').each((_, el) => {
    if (videoUrl) return false
    const text = $(el).html() || ''
    for (const field of ['video_url', 'playable_url', 'contentUrl']) {
      const match = text.match(new RegExp(`"${field}"\\s*:\\s*"([^"]*twimg[^"]*)"`) )
      if (match) {
        videoUrl = decodeTwitterUrl(match[1])
        return false
      }
    }
  })

  return videoUrl
}

/** Strategy 3: Twitter embed page script data */
async function fetchViaEmbedPage(tweetId: string): Promise<string> {
  const embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&dnt=false&lang=en`

  const res = await fetch(embedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  })

  if (!res.ok) return ''

  const html = await res.text()
  const $ = cheerio.load(html)

  let videoUrl = ''
  $('script').each((_, el) => {
    if (videoUrl) return false
    const text = $(el).html() || ''
    for (const field of ['video_url', 'playable_url']) {
      const match = text.match(new RegExp(`"${field}"\\s*:\\s*"([^"]*twimg[^"]*)"`) )
      if (match) {
        videoUrl = decodeTwitterUrl(match[1])
        return false
      }
    }
  })

  return videoUrl
}

async function fetchTwitterVideoUrl(tweetUrl: string): Promise<string> {
  const tweetId = extractTweetId(tweetUrl)
  if (!tweetId) return ''

  // Strategy 1: Syndication API
  try {
    const url = await fetchViaSyndicationApi(tweetId)
    if (url) return url
  } catch {
    // fall through
  }

  // Strategy 2: Page scrape with crawler UA
  try {
    const url = await fetchViaPageScrape(tweetUrl)
    if (url) return url
  } catch {
    // fall through
  }

  // Strategy 3: Embed page
  try {
    const url = await fetchViaEmbedPage(tweetId)
    if (url) return url
  } catch {
    // fall through
  }

  return ''
}

async function fetchTwitterMeta(tweetUrl: string): Promise<{ title: string; description: string; thumbnailUrl: string }> {
  try {
    const res = await fetch(tweetUrl, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uagent.php)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })

    if (!res.ok) return { title: 'X / Twitter Video', description: '', thumbnailUrl: '' }

    const html = await res.text()
    const $ = cheerio.load(html)

    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      'X / Twitter Video'
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      ''
    const thumbnailUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      ''

    return { title, description, thumbnailUrl }
  } catch {
    return { title: 'X / Twitter Video', description: '', thumbnailUrl: '' }
  }
}

export async function fetchTwitterVideo(url: string): Promise<TwitterVideoMetadata> {
  const [videoUrl, { title, description, thumbnailUrl }] = await Promise.all([
    fetchTwitterVideoUrl(url),
    fetchTwitterMeta(url),
  ])

  if (!videoUrl) {
    throw new Error('Could not extract video from this tweet. The tweet may not contain a video, may be private, or the URL may be invalid.')
  }

  return { videoUrl, thumbnailUrl, title, description }
}
