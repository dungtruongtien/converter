import { NextRequest, NextResponse } from 'next/server'
import { getSession, deleteSession } from '@/lib/session-store'

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET
  if (!secret) {
    console.warn('RECAPTCHA_SECRET not set — skipping verification in dev mode')
    return true
  }

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  })

  const data = await res.json()
  return data.success === true
}

export async function POST(req: NextRequest) {
  let body: { sessionId?: string; captchaToken?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { sessionId, captchaToken } = body
  if (!sessionId || !captchaToken) {
    return NextResponse.json({ error: 'sessionId and captchaToken are required' }, { status: 400 })
  }

  const session = getSession(sessionId)
  if (!session) {
    return NextResponse.json({ error: 'Session expired or not found. Please start over.' }, { status: 404 })
  }

  const valid = await verifyRecaptcha(captchaToken)
  if (!valid) {
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 403 })
  }

  const videoUrl = session.imageUrl
  deleteSession(sessionId)

  return NextResponse.json({ videoUrl })
}
