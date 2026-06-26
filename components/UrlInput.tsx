'use client'

import { useState } from 'react'

interface UrlInputProps {
  onSubmit: (url: string) => void
  loading: boolean
  label?: string
  placeholder?: string
}

export default function UrlInput({ onSubmit, loading, label = 'Instagram Post URL', placeholder = 'https://www.instagram.com/p/XXXXXX/' }: UrlInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) onSubmit(url.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="ig-url" className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id="ig-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          required
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </div>
    </form>
  )
}
