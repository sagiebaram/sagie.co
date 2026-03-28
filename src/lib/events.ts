import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'

import { type SAGIEEvent } from '@/types/events'

export type { SAGIEEvent }

export const getUpcomingEvents = unstable_cache(
  async (): Promise<SAGIEEvent[]> => {
    const response = await notion.databases.query({
      database_id: env.NOTION_EVENT_DB_ID,
      filter: {
        and: [
          { property: 'Status', select: { does_not_equal: 'Cancelled' } },
          { property: 'Status', select: { does_not_equal: 'Complete' } },
        ],
      },
      sorts: [{ property: 'Event Date', direction: 'ascending' }],
    })
    return response.results.map(mapEvent)
  },
  ['notion:events:upcoming'],
  { revalidate: 300, tags: ['notion:events'] }
)

export const getPastEvents = unstable_cache(
  async (): Promise<SAGIEEvent[]> => {
    const response = await notion.databases.query({
      database_id: env.NOTION_EVENT_DB_ID,
      filter: { property: 'Status', select: { equals: 'Complete' } },
      sorts: [{ property: 'Event Date', direction: 'descending' }],
    })
    return response.results.map(mapEvent)
  },
  ['notion:events:past'],
  { revalidate: 300, tags: ['notion:events'] }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapEvent(page: any): SAGIEEvent {
  const p = page.properties
  const dateStr: string | null = p['Event Date']?.date?.start ?? null
  const time: string | null = dateStr?.includes('T') ? dateStr.slice(11, 16) : null
  return {
    id: page.id,
    name: p['Event Name']?.title?.[0]?.plain_text ?? 'Untitled',
    date: dateStr,
    time,
    type: p['Type']?.select?.name ?? null,
    format: p['Format']?.select?.name ?? null,
    status: p['Status']?.select?.name ?? 'Concept',
    venue: p['Venue']?.rich_text?.[0]?.plain_text ?? null,
    description: p['Description']?.rich_text?.[0]?.plain_text ?? null,
    expectedAttendees: p['Expected Attendees']?.number ?? null,
    actualAttendees: p['Actual Attendees']?.number ?? null,
    tierTarget: p['Tier Target']?.select?.name ?? null,
    chapter: null,
    speakers: p['Speakers']?.rich_text?.[0]?.plain_text ?? null,
    webinarLink: p['Webinar Link']?.url ?? null,
    recordingLink: p['Recording Link']?.url ?? null,
    photoGallery: p['Photo Gallery']?.url ?? null,
    eventImage: p['Event Image']?.url ?? null,
    registrationLink: p['Registration Link']?.url ?? null,
    moreInfoLink: p['More Info Link']?.url ?? null,
    recapLink: p['Recap Link']?.url ?? null,
  }
}

