'use client'

import ReCAPTCHA from 'react-google-recaptcha'

interface CaptchaGateProps {
  siteKey: string
  title: string
  description: string
  onVerify: (token: string) => void
  loading: boolean
}

export default function CaptchaGate({ siteKey, title, description, onVerify, loading }: CaptchaGateProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Post preview */}
      <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Post found</p>
        <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-gray-700 line-clamp-3">{description}</p>
        )}
      </div>

      {/* Blurred image placeholder */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100" style={{ aspectRatio: '1/1' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/30 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm font-semibold text-gray-800">Verify you&apos;re human to reveal the image</p>
        </div>
      </div>

      {/* reCAPTCHA */}
      <div className="flex flex-col items-center gap-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying...
          </div>
        ) : (
          <ReCAPTCHA sitekey={siteKey} onChange={(token) => token && onVerify(token)} />
        )}
        <p className="text-xs text-gray-600 text-center max-w-xs">
          Complete the verification above to unlock the image.
        </p>
      </div>
    </div>
  )
}
