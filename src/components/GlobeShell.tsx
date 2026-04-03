import { Suspense } from 'react'
import { getMemberCities } from '@/lib/members'
import { getChapters } from '@/lib/chapters'
import { GlobeClient } from './GlobeClient'

export async function GlobeShell() {
  const [memberCities, chapters] = await Promise.all([
    getMemberCities(),
    getChapters(),
  ])

  // Build a set of chapter city names (lowercase) so we can mark member-city dots
  const chapterCityNames = new Set(
    chapters
      .filter((ch) => ch.city)
      .map((ch) => ch.city!.toLowerCase())
  )

  // Member cities with isChapter flag based on chapter DB
  const mergedCities = memberCities.map((city) => ({
    ...city,
    isChapter: chapterCityNames.has(city.name.toLowerCase()),
  }))

  // Build chapter pins from DB lat/lng for globe rendering
  const chapterPins = chapters
    .filter((ch) => ch.latitude != null && ch.longitude != null)
    .map((ch) => ({
      id: `chapter-${ch.id}`,
      name: ch.name,
      lat: ch.latitude!,
      lng: ch.longitude!,
      members: ch.memberCount ?? 0,
      isChapter: ch.status === 'Active',
      isChapterPin: true,
      chapterStatus: ch.status,
    }))

  return (
    <div className="relative w-full">
      <Suspense fallback={<div className="h-[400px] rounded-full bg-border-subtle animate-pulse" />}>
        <GlobeClient cities={mergedCities} chapterPins={chapterPins} />
      </Suspense>
    </div>
  )
}
