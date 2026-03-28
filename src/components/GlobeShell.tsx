'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const GlobeNetwork = dynamic(
  () => import('./GlobeNetwork').then(mod => ({ default: mod.GlobeNetwork })),
  { ssr: false }
)

export function GlobeShell() {
  return (
    <div className="relative aspect-square w-full max-w-[420px]">
      <Suspense fallback={<div className="absolute inset-0 rounded-full bg-white/5 animate-pulse" />}>
        <GlobeNetwork />
      </Suspense>
    </div>
  )
}
