import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return new NextResponse('Missing url', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  const allowed =
    parsed.hostname.endsWith('.fbcdn.net') ||
    parsed.hostname.endsWith('.cdninstagram.com') ||
    parsed.hostname.endsWith('.twimg.com')
  if (!allowed) return new NextResponse('Forbidden', { status: 403 })

  // Redirect the browser directly to the CDN URL — avoids server-side fetch
  // being blocked by Instagram CDN's datacenter IP filtering.
  return NextResponse.redirect(url, { status: 302 })
}
