import { NextRequest, NextResponse } from 'next/server'
import { fetchInstagramOgImage, isValidInstagramUrl } from '@/lib/instagram'
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

  if (!isValidInstagramUrl(url)) {
    return NextResponse.json(
      { error: 'Invalid URL. Please provide a valid Instagram post URL (e.g. https://www.instagram.com/p/XXXXX/)' },
      { status: 400 }
    )
  }

  try {
    const { imageUrl, title, description } = await fetchInstagramOgImage(url)
    const sessionId = createSession(imageUrl)
    return NextResponse.json({ sessionId, title, description })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Instagram post'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
