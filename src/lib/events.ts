import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'
import { getTitleProperty, getTextProperty, getSelectProperty, getUrlProperty, getNumberProperty, getDateProperty } from './notion-utils'

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

 
export function mapEvent(page: any): SAGIEEvent {
  const p = page.properties
  const id = page.id
  const dateStr = getDateProperty(p, 'Event Date', id)
  const time: string | null = dateStr?.includes('T') ? dateStr.slice(11, 16) : null
  return {
    id,
    name: getTitleProperty(p, 'Event Name', id, 'Untitled'),
    date: dateStr,
    time,
    type: (getSelectProperty(p, 'Type', id, '') || null) as SAGIEEvent['type'],
    format: getSelectProperty(p, 'Format', id, '') || null,
    status: getSelectProperty(p, 'Status', id, 'Concept') as SAGIEEvent['status'],
    venue: getTextProperty(p, 'Venue', id, '') || null,
    description: getTextProperty(p, 'Description', id, '') || null,
    expectedAttendees: getNumberProperty(p, 'Expected Attendees', id),
    actualAttendees: getNumberProperty(p, 'Actual Attendees', id),
    tierTarget: getSelectProperty(p, 'Tier Target', id, '') || null,
    chapter: null,
    speakers: getTextProperty(p, 'Speakers', id, '') || null,
    webinarLink: getUrlProperty(p, 'Webinar Link', id),
    recordingLink: getUrlProperty(p, 'Recording Link', id),
    photoGallery: getUrlProperty(p, 'Photo Gallery', id),
    eventImage: getUrlProperty(p, 'Event Image', id),
    registrationLink: getUrlProperty(p, 'Registration Link', id),
    moreInfoLink: getUrlProperty(p, 'More Info Link', id),
    recapLink: getUrlProperty(p, 'Recap Link', id),
  }
}
