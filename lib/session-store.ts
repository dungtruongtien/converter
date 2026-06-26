import { randomUUID } from 'crypto'

interface SessionData {
  imageUrl: string
  createdAt: number
}

// Use globalThis to survive Next.js hot-module-reload in dev
const g = globalThis as typeof globalThis & { __sessions?: Map<string, SessionData> }
if (!g.__sessions) g.__sessions = new Map<string, SessionData>()
const sessions = g.__sessions

const SESSION_TTL_MS = 5 * 60 * 1000 // 5 minutes

function cleanup() {
  const now = Date.now()
  for (const [id, data] of Array.from(sessions.entries())) {
    if (now - data.createdAt > SESSION_TTL_MS) {
      sessions.delete(id)
    }
  }
}

export function createSession(imageUrl: string): string {
  cleanup()
  const id = randomUUID()
  sessions.set(id, { imageUrl, createdAt: Date.now() })
  return id
}

export function getSession(id: string): SessionData | null {
  const data = sessions.get(id)
  if (!data) return null
  if (Date.now() - data.createdAt > SESSION_TTL_MS) {
    sessions.delete(id)
    return null
  }
  return data
}

export function deleteSession(id: string) {
  sessions.delete(id)
}
