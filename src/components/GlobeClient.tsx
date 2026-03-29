'use client'

import dynamic from 'next/dynamic'
import type { CityData } from '@/lib/members'

const GlobeNetwork = dynamic(
  () => import('./GlobeNetwork').then((m) => ({ default: m.GlobeNetwork })),
  { ssr: false }
)

export interface ChapterPin {
  id: string
  name: string
  lat: number
  lng: number
  members: number
  isChapter: boolean
  isChapterPin: boolean
  chapterStatus: 'Active' | 'Coming Soon' | 'Planned'
}

export function GlobeClient({
  cities,
  chapterPins = [],
}: {
  cities: CityData[]
  chapterPins?: ChapterPin[]
}) {
  return <GlobeNetwork cities={cities} chapterPins={chapterPins} />
}
