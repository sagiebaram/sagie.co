import { Suspense } from 'react'
import { getMemberCities } from '@/lib/members'
import { getChapters } from '@/lib/chapters'
import { GlobeClient } from './GlobeClient'

export async function GlobeShell() {
  const [memberCities, chapters] = await Promise.all([
    getMemberCities(),
    getChapters(),
  ])

  // Cross-reference: mark cities as chapters when their name matches a chapter's location (case-insensitive)
  const chapterLocations = new Set(
    chapters.map((ch) => ch.location.toLowerCase())
  )

  const mergedCities = memberCities.map((city) => ({
    ...city,
    isChapter: chapterLocations.has(city.name.toLowerCase()),
  }))

  return (
    <div className="relative w-full max-w-[800px]">
      <Suspense fallback={<div className="h-[400px] rounded-full bg-white/5 animate-pulse" />}>
        <GlobeClient cities={mergedCities} />
      </Suspense>
    </div>
  )
}
