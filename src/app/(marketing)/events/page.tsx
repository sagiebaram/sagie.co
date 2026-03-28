import { getUpcomingEvents, getPastEvents, type SAGIEEvent } from '@/lib/events'
import { EventsPageClient } from './EventsPageClient'

export const revalidate = 300

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
