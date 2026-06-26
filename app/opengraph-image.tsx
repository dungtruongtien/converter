import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Gadify – Free Instagram Downloader'
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
        <div style={{ fontSize: 88, fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-2px' }}>
          Gadify
        </div>
        <div style={{ fontSize: 38, color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: 900, lineHeight: 1.3, marginBottom: 40 }}>
          Download Instagram Photos, Reels & Facebook Videos Free
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['No Login', 'No Watermark', 'No App Required'].map((tag) => (
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
          gadify.app
        </div>
      </div>
    ),
    { ...size }
  )
}
