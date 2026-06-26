import { NextRequest, NextResponse } from 'next/server'
import { fetchInstagramReel, isValidInstagramReelUrl } from '@/lib/instagram'
import { createSession } from '@/lib/session-store'

export async function POST(req: NextRequest) {
  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { url } = body
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  if (!isValidInstagramReelUrl(url)) {
    return NextResponse.json(
      { error: 'Invalid URL. Please provide a valid Instagram Reel URL (e.g. https://www.instagram.com/reel/XXXXX/)' },
      { status: 400 }
    )
  }

  try {
    const { videoUrl, thumbnailUrl, title, description } = await fetchInstagramReel(url)
    const sessionId = createSession(videoUrl)
    return NextResponse.json({ sessionId, thumbnailUrl, title, description })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Instagram Reel'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
