'use client'

import { useState } from 'react'
import UrlInput from '@/components/UrlInput'
import CaptchaGate from '@/components/CaptchaGate'
import VideoDisplay from '@/components/VideoDisplay'
import AdUnit from '@/components/AdUnit'

type Stage = 'input' | 'captcha' | 'revealed'

interface ReelMeta {
  sessionId: string
  thumbnailUrl: string
  title: string
  description: string
}

const STAGES: Stage[] = ['input', 'captcha', 'revealed']

export default function FacebookClient({ siteKey }: { siteKey: string }) {
  const [stage, setStage] = useState<Stage>('input')
  const [meta, setMeta] = useState<ReelMeta | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUrlSubmit = async (url: string) => {
    // Fire AdCash interstitial
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).aclib) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).aclib.runAutoTag({ zoneId: 'a5fglb9yw0' })
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/facebook/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to fetch reel'); return }
      setMeta({ sessionId: data.sessionId, thumbnailUrl: data.thumbnailUrl, title: data.title, description: data.description })
      setStage('captcha')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCaptchaVerify = async (token: string) => {
    if (!meta) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/facebook/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: meta.sessionId, captchaToken: token }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Verification failed'); return }
      setVideoUrl(data.videoUrl)
      setStage('revealed')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStage('input')
    setMeta(null)
    setVideoUrl(null)
    setError(null)
    setLoading(false)
  }

  const stageIndex = STAGES.indexOf(stage)

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      {/* Left sidebar ad */}
      <aside className="hidden lg:block w-[160px] shrink-0" aria-label="Advertisement">
        <AdUnit slot="1234567894" format="vertical" className="sticky top-8 rounded-xl bg-gray-100 min-h-[600px]" />
      </aside>

      {/* Main card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {/* Progress steps */}
          <ol aria-label="Steps" className="flex items-center justify-center gap-2 mb-6">
            {STAGES.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  stage === s ? 'bg-blue-500 text-white' :
                  stageIndex > i ? 'bg-green-400 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {stageIndex > i ? '✓' : i + 1}
                </div>
                {i < 2 && <div className={`h-0.5 w-8 rounded ${stageIndex > i ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </li>
            ))}
          </ol>

          {/* Error */}
          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
              {stage !== 'input' && (
                <button onClick={handleReset} className="ml-2 underline text-red-600 hover:text-red-800">
                  Start over
                </button>
              )}
            </div>
          )}

          {stage === 'input' && (
            <UrlInput
              onSubmit={handleUrlSubmit}
              loading={loading}
              label="Facebook Reel URL"
              placeholder="https://www.facebook.com/reel/123456789"
            />
          )}

          {stage === 'captcha' && meta && (
            <CaptchaGate
              siteKey={siteKey}
              title={meta.title}
              description={meta.description}
              onVerify={handleCaptchaVerify}
              loading={loading}
            />
          )}

          {stage === 'revealed' && videoUrl && meta && (
            <VideoDisplay
              videoUrl={videoUrl}
              thumbnailUrl={meta.thumbnailUrl}
              title={meta.title}
              onReset={handleReset}
            />
          )}
        </div>

        {/* In-content ad below card */}
        <div aria-label="Advertisement">
          <AdUnit slot="1234567895" format="rectangle" className="mt-6 rounded-xl bg-gray-100 min-h-[250px]" />
        </div>
      </div>

      {/* Right sidebar ad */}
      <aside className="hidden lg:block w-[160px] shrink-0" aria-label="Advertisement">
        <AdUnit slot="1234567896" format="vertical" className="sticky top-8 rounded-xl bg-gray-100 min-h-[600px]" />
      </aside>
    </div>
  )
}
