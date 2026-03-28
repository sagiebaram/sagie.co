'use client'

import dynamic from 'next/dynamic'
import type { CityData } from '@/lib/members'

const GlobeNetwork = dynamic(
  () => import('./GlobeNetwork').then((m) => ({ default: m.GlobeNetwork })),
  { ssr: false }
)

export function GlobeClient({ cities }: { cities: CityData[] }) {
  return <GlobeNetwork cities={cities} />
}
