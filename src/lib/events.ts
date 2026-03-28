import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'

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
  registrationLink: string | null
  moreInfoLink: string | null
  recapLink: string | null
}

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

// ---------------------------------------------------------------------------
// ICS / Calendar helpers — pure functions, exported for use in route handlers
// ---------------------------------------------------------------------------

/**
 * Escape text per RFC 5545 §3.3.11:
 * backslash, semicolon, comma, and newline must be escaped.
 */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Build a Google Calendar deep link for the given event.
 * - All-day events: dates=YYYYMMDD/YYYYMMDD+1
 * - Timed events:   dates=YYYYMMDDTHHmmss/YYYYMMDDTHHmmss (start + 1 hour)
 */
export function buildGoogleCalendarUrl(event: SAGIEEvent): string {
  const base = 'https://calendar.google.com/calendar/render'
  const params = new URLSearchParams({ action: 'TEMPLATE' })

  params.set('text', event.name)

  if (event.date) {
    const datePart = event.date.replace(/-/g, '')
    if (event.time) {
      // Timed event
      const [hh, mm] = event.time.split(':')
      const startStr = `${datePart}T${hh}${mm}00`
      // End = start + 1 hour
      const endHour = String(parseInt(hh!, 10) + 1).padStart(2, '0')
      const endStr = `${datePart}T${endHour}${mm}00`
      params.set('dates', `${startStr}/${endStr}`)
    } else {
      // All-day: end date is the next calendar day
      const startDate = new Date(`${event.date}T00:00:00Z`)
      const endDate = new Date(startDate)
      endDate.setUTCDate(endDate.getUTCDate() + 1)
      const endPart = endDate.toISOString().slice(0, 10).replace(/-/g, '')
      params.set('dates', `${datePart}/${endPart}`)
    }
  }

  if (event.venue) {
    params.set('location', event.venue)
  }

  const details = [
    event.description ?? '',
    event.registrationLink ? `Register: ${event.registrationLink}` : '',
  ]
    .filter(Boolean)
    .join('\n')
  if (details) {
    params.set('details', details)
  }

  return `${base}?${params.toString()}`
}

/**
 * Build an Outlook Web Calendar deep link for the given event.
 */
export function buildOutlookCalendarUrl(event: SAGIEEvent): string {
  const base = 'https://outlook.live.com/calendar/0/action/compose'
  const params = new URLSearchParams({ rru: 'addevent' })

  params.set('subject', event.name)

  if (event.date) {
    if (event.time) {
      const [hh, mm] = event.time.split(':')
      const startIso = `${event.date}T${hh}:${mm}:00`
      const endHour = String(parseInt(hh!, 10) + 1).padStart(2, '0')
      const endIso = `${event.date}T${endHour}:${mm}:00`
      params.set('startdt', startIso)
      params.set('enddt', endIso)
    } else {
      // All-day
      const startDate = new Date(`${event.date}T00:00:00Z`)
      const endDate = new Date(startDate)
      endDate.setUTCDate(endDate.getUTCDate() + 1)
      params.set('startdt', event.date)
      params.set('enddt', endDate.toISOString().slice(0, 10))
      params.set('allday', 'true')
    }
  }

  if (event.venue) {
    params.set('location', event.venue)
  }

  const body = [
    event.description ?? '',
    event.registrationLink ? `Register: ${event.registrationLink}` : '',
  ]
    .filter(Boolean)
    .join('\n')
  if (body) {
    params.set('body', body)
  }

  return `${base}?${params.toString()}`
}

/**
 * Generate RFC 5545-compliant ICS file content for a single event.
 * - All-day events use DTSTART;VALUE=DATE:YYYYMMDD
 * - Timed events use DTSTART:YYYYMMDDTHHmmssZ
 * Uses \r\n line endings as required by RFC 5545.
 */
export function buildIcsContent(event: SAGIEEvent): string {
  const now = new Date()
  const dtstamp =
    now.getUTCFullYear().toString() +
    String(now.getUTCMonth() + 1).padStart(2, '0') +
    String(now.getUTCDate()).padStart(2, '0') +
    'T' +
    String(now.getUTCHours()).padStart(2, '0') +
    String(now.getUTCMinutes()).padStart(2, '0') +
    String(now.getUTCSeconds()).padStart(2, '0') +
    'Z'

  let dtstart: string
  let dtend: string

  if (event.date && event.time) {
    const [hh, mm] = event.time.split(':')
    const datePart = event.date.replace(/-/g, '')
    dtstart = `DTSTART:${datePart}T${hh}${mm}00Z`
    const endHour = String(parseInt(hh!, 10) + 1).padStart(2, '0')
    dtend = `DTEND:${datePart}T${endHour}${mm}00Z`
  } else if (event.date) {
    const datePart = event.date.replace(/-/g, '')
    dtstart = `DTSTART;VALUE=DATE:${datePart}`
    // End = next day for all-day
    const startDate = new Date(`${event.date}T00:00:00Z`)
    const endDate = new Date(startDate)
    endDate.setUTCDate(endDate.getUTCDate() + 1)
    const endPart = endDate.toISOString().slice(0, 10).replace(/-/g, '')
    dtend = `DTEND;VALUE=DATE:${endPart}`
  } else {
    dtstart = 'DTSTART;VALUE=DATE:19700101'
    dtend = 'DTEND;VALUE=DATE:19700102'
  }

  const descParts = [
    event.description ? escapeIcsText(event.description) : '',
    event.registrationLink ? `Register: ${escapeIcsText(event.registrationLink)}` : '',
  ].filter(Boolean)
  const description = descParts.length > 0 ? `DESCRIPTION:${descParts.join('\\n')}` : ''

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//sagie.co//SAGIE Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@sagie.co`,
    `DTSTAMP:${dtstamp}`,
    dtstart,
    dtend,
    `SUMMARY:${escapeIcsText(event.name)}`,
    event.venue ? `LOCATION:${escapeIcsText(event.venue)}` : '',
    description,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter((line) => line !== '')

  return lines.join('\r\n') + '\r\n'
}
