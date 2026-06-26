'use client'

interface ImageDisplayProps {
  imageUrl: string    // proxy URL for display
  downloadUrl: string // ad-shortened URL for download
  title: string
  onReset: () => void
}

export default function ImageDisplay({ imageUrl, downloadUrl, title, onReset }: ImageDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full overflow-hidden rounded-xl shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full object-cover"
        />
      </div>

      <div className="flex w-full gap-3">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:from-purple-600 hover:to-pink-600"
        >
          Download Image
        </a>
        <button
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
        >
          New Post
        </button>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Note: Instagram CDN links are time-limited. Download promptly.
      </p>
    </div>
  )
}
