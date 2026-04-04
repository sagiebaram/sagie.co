import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getUpcomingEvents, getPastEvents, type SAGIEEvent } from '@/lib/events'
import { Skeleton } from '@/components/ui/Skeleton'
import { EventsPageClient } from './EventsPageClient'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Discover upcoming SAGIE community events — meetups, workshops, and gatherings for founders, operators, and builders.',
  openGraph: {
    title: 'Events | SAGIE',
    description:
      'Discover upcoming SAGIE community events — meetups, workshops, and gatherings for founders, operators, and builders.',
  },
}

function EventsSkeleton() {
  return (
    <div className="max-w-[880px] mx-auto px-6 md:px-8 py-12">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-b border-border-subtle py-5 flex items-center gap-4">
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  )
}

async function EventsContent() {
  let upcoming: SAGIEEvent[] = []
  let past: SAGIEEvent[] = []
  let fetchError = false

  try {
    ;[upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()])
  } catch (e) {
    console.error('Failed to fetch events:', e)
    fetchError = true
  }

  return (
    <EventsPageClient upcoming={upcoming} past={past} fetchError={fetchError} />
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsSkeleton />}>
      <EventsContent />
    </Suspense>
  )
}
