import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  // Only allow Instagram/Facebook CDN URLs
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  const allowed = parsed.hostname.endsWith('.fbcdn.net') || parsed.hostname.endsWith('.cdninstagram.com')
  if (!allowed) return new NextResponse('Forbidden', { status: 403 })

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Accept': 'image/avif,image/webp,image/apng,*/*',
      'Referer': 'https://www.instagram.com/',
    },
  })

  if (!res.ok) return new NextResponse('Failed to fetch image', { status: res.status })

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const buffer = await res.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
