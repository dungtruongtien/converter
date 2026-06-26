import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Instagram Photo Downloader – Download Instagram Photos Free'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-1px', textAlign: 'center' }}>
          Instagram Photo Downloader
        </div>
        <div style={{ fontSize: 36, color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 900, lineHeight: 1.4, marginBottom: 40 }}>
          Download full-resolution Instagram photos free — no login, no watermark
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Free', 'Full Resolution', 'No Watermark'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 100,
                padding: '8px 24px',
                color: 'white',
                fontSize: 24,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 40, color: 'rgba(255,255,255,0.55)', fontSize: 22 }}>
          toolfree.app
        </div>
      </div>
    ),
    { ...size }
  )
}
