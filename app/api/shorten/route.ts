import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  const key = process.env.OUO_API_KEY
  if (!key) return NextResponse.json({ shortUrl: url })
  try {
    const res = await fetch(
      `https://ouo.io/api/${key}?s=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(3000) }
    )
    const shortUrl = await res.text()
    // ouo.io returns the short URL as plain text, or an error message
    return NextResponse.json({ shortUrl: shortUrl.startsWith('https://') ? shortUrl : url })
  } catch {
    return NextResponse.json({ shortUrl: url })
  }
}
