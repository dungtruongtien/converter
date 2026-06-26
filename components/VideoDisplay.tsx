'use client'

import { useState } from 'react'

interface VideoDisplayProps {
  videoUrl: string
  thumbnailUrl: string
  title: string
  onReset: () => void
}

export default function VideoDisplay({ videoUrl, thumbnailUrl, title, onReset }: VideoDisplayProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Fetch the video directly from CDN in the browser context (avoids server-side 403).
      const res = await fetch(videoUrl, { mode: 'cors' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = 'instadown-reel.mp4'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch {
      // CDN may not send CORS headers for fetch — fall back to opening in a new tab.
      // The browser will either auto-download (mobile) or play inline (desktop: right-click → Save As).
      window.open(videoUrl, '_blank', 'noopener,noreferrer')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-xl shadow-lg bg-black">
        <video
          src={videoUrl}
          poster={thumbnailUrl || undefined}
          controls
          playsInline
          className="w-full max-h-[500px]"
          aria-label={title}
        />
      </div>

      <div className="flex w-full gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {downloading ? 'Downloading…' : 'Download Reel'}
        </button>
        <button
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
        >
          New Reel
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Note: Instagram CDN links are time-limited. Download promptly.
        If the video opens in a new tab, right-click it and choose <em>Save video as…</em>
      </p>
    </div>
  )
}
