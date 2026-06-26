'use client'

import { useEffect, useRef } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    const ins = insRef.current
    if (!ins || ins.getAttribute('data-adsbygoogle-status')) return
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // ads blocked or not loaded yet
    }
  }, [])

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5200581180131547"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-adtest="off"
      />
    </div>
  )
}
