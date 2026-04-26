'use client'

import { useRef, useState, useEffect } from 'react'
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
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {visible ? (
        <GlobeNetwork cities={cities} chapterPins={chapterPins} />
      ) : (
        <div className="h-[400px]" />
      )}
    </div>
  )
}
