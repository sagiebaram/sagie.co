import type { Metadata } from 'next'
import { getUpcomingEvents, getPastEvents, type SAGIEEvent } from '@/lib/events'
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

export default async function EventsPage() {
  let upcoming: SAGIEEvent[] = []
  let past: SAGIEEvent[] = []

  try {
    ;[upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()])
  } catch (e) {
    console.error('Failed to fetch events:', e)
  }

  return <EventsPageClient upcoming={upcoming} past={past} />
}
