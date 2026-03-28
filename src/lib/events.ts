import { notion } from './notion'

export interface SAGIEEvent {
  id: string
  name: string
  date: string | null
  time: string | null
  type: 'SAGIE Event' | 'Local Event' | 'Webinar' | null
  format: string | null
  status: 'Concept' | 'Planning' | 'Confirmed' | 'Live' | 'Complete' | 'Cancelled'
  venue: string | null
  description: string | null
  expectedAttendees: number | null
  actualAttendees: number | null
  tierTarget: string | null
  chapter: string | null
  speakers: string | null
  webinarLink: string | null
  recordingLink: string | null
  photoGallery: string | null
  eventImage: string | null
}

export async function getUpcomingEvents(): Promise<SAGIEEvent[]> {
  const response = await (notion as any).databases.query({
    database_id: process.env.NOTION_EVENT_DB_ID!,
    filter: {
      and: [
        { property: 'Status', select: { does_not_equal: 'Cancelled' } },
        { property: 'Status', select: { does_not_equal: 'Complete' } },
      ],
    },
    sorts: [{ property: 'Event Date', direction: 'ascending' }],
  })
  return response.results.map(mapEvent)
}

export async function getPastEvents(): Promise<SAGIEEvent[]> {
  const response = await (notion as any).databases.query({
    database_id: process.env.NOTION_EVENT_DB_ID!,
    filter: { property: 'Status', select: { equals: 'Complete' } },
    sorts: [{ property: 'Event Date', direction: 'descending' }],
  })
  return response.results.map(mapEvent)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvent(page: any): SAGIEEvent {
  const p = page.properties
  return {
    id: page.id,
    name: p['Event Name']?.title?.[0]?.plain_text ?? 'Untitled',
    date: p['Event Date']?.date?.start ?? null,
    time: null,
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
  }
}
