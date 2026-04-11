'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  slot: string
  format?: string
  responsive?: boolean
  className?: string
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5634358982750683";

export default function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // silencioso en desarrollo
    }
  }, [])

  return (
    <div className={`text-center my-8 ${className}`}>
      <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest text-center mb-1">
        Publicidad
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={String(responsive)}
      />
    </div>
  )
}
