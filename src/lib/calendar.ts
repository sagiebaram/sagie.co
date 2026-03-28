import type { SAGIEEvent } from '@/types/events'

// ---------------------------------------------------------------------------
// ICS / Calendar helpers — pure functions, safe for client and server use
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
      const [hh, mm] = event.time.split(':')
      const startStr = `${datePart}T${hh}${mm}00`
      const endHour = String(parseInt(hh!, 10) + 1).padStart(2, '0')
      const endStr = `${datePart}T${endHour}${mm}00`
      params.set('dates', `${startStr}/${endStr}`)
    } else {
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
