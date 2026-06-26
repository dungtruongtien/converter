import * as cheerio from 'cheerio'

export interface FacebookReelMetadata {
  videoUrl: string
  thumbnailUrl: string
  title: string
  description: string
}

export function isValidFacebookReelUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      (parsed.hostname === 'www.facebook.com' || parsed.hostname === 'facebook.com') &&
      /^\/reel\/\d+\/?/.test(parsed.pathname)
    )
  } catch {
    return false
  }
}

/** Decode a raw URL string extracted from Facebook's embed page JSON/HTML */
function decodeFacebookUrl(raw: string): string {
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

function extractVideoUrlFromHtml(html: string): string {
  const $ = cheerio.load(html)

  // Pattern 1: <video src> or <source src> containing fbcdn
  let videoUrl = ''
  $('video, source').each((_, el) => {
    const src = $(el).attr('src') || ''
    if (src.includes('fbcdn')) {
      videoUrl = decodeFacebookUrl(src)
      return false
    }
  })
  if (videoUrl) return videoUrl

  // Patterns 2-6: script tag JSON fields
  $('script').each((_, el) => {
    const text = $(el).html() || ''

    for (const field of ['playable_url', 'browser_native_hd_url', 'browser_native_sd_url', 'video_url', 'contentUrl']) {
      const plainMatch = text.match(new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`))
      if (plainMatch) {
        videoUrl = decodeFacebookUrl(plainMatch[1])
        return false
      }
      if (field === 'video_url') {
        const escapedMatch = text.match(/\\"video_url\\":\s*\\"((?:[^"\\]|\\.)*?)\\"/)
        if (escapedMatch) {
          videoUrl = decodeFacebookUrl(escapedMatch[1])
          return false
        }
      }
    }
  })
  if (videoUrl) return videoUrl

  // Pattern 7: og:video meta tags
  const ogVideo =
    $('meta[property="og:video:url"]').attr('content') ||
    $('meta[property="og:video:secure_url"]').attr('content') ||
    $('meta[property="og:video"]').attr('content') ||
    ''
  if (ogVideo.includes('fbcdn')) {
    return decodeFacebookUrl(ogVideo)
  }

  return ''
}

async function fetchFacebookReelVideo(reelUrl: string): Promise<string> {
  const crawlerUA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uagent.php)'
  const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'

  // Attempt 1: facebookexternalhit UA on reel URL → og:video
  try {
    const res = await fetch(reelUrl, {
      headers: {
        'User-Agent': crawlerUA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    if (res.ok) {
      const html = await res.text()
      const videoUrl = extractVideoUrlFromHtml(html)
      if (videoUrl) return videoUrl
    }
  } catch {
    // fall through
  }

  // Attempt 2: Mobile Safari UA on reel URL → script tag JSON
  try {
    const res = await fetch(reelUrl, {
      headers: {
        'User-Agent': mobileUA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    if (res.ok) {
      const html = await res.text()
      const videoUrl = extractVideoUrlFromHtml(html)
      if (videoUrl) return videoUrl
    }
  } catch {
    // fall through
  }

  // Attempt 3: facebookexternalhit UA on embed URL → fallback
  const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reelUrl)}&show_text=false`
  try {
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': crawlerUA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    if (res.ok) {
      const html = await res.text()
      return extractVideoUrlFromHtml(html)
    }
  } catch {
    // fall through
  }

  return ''
}

async function fetchFacebookReelMeta(url: string): Promise<{ title: string; description: string; thumbnailUrl: string }> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uagent.php)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
  })

  if (!res.ok) return { title: 'Facebook Reel', description: '', thumbnailUrl: '' }

  const html = await res.text()
  const $ = cheerio.load(html)

  const title = $('meta[property="og:title"]').attr('content') || 'Facebook Reel'
  const description = $('meta[property="og:description"]').attr('content') || ''
  const thumbnailUrl = $('meta[property="og:image"]').attr('content') || ''

  return { title, description, thumbnailUrl }
}

export async function fetchFacebookReel(url: string): Promise<FacebookReelMetadata> {
  const [videoUrl, { title, description, thumbnailUrl }] = await Promise.all([
    fetchFacebookReelVideo(url),
    fetchFacebookReelMeta(url),
  ])

  if (!videoUrl) {
    throw new Error('Could not extract video from this Facebook Reel. The reel may be private or the URL may be invalid.')
  }

  return { videoUrl, thumbnailUrl, title, description }
}
