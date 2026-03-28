import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))
vi.mock('@/env/server', () => ({
  env: {
    NOTION_BLOG_DB_ID: 'mock-blog-db',
    NOTION_EVENT_DB_ID: 'mock-events-db',
    NOTION_RESOURCES_DB_ID: 'mock-resources-db',
    NOTION_SOLUTIONS_DB_ID: 'mock-solutions-db',
    NOTION_TOKEN: 'mock-token',
  },
}))
vi.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: vi.fn() },
    pages: { retrieve: vi.fn() },
  },
}))

import {
  getUpcomingEvents,
  getPastEvents,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  buildIcsContent,
  escapeIcsText,
} from '@/lib/events'
import { notion } from '@/lib/notion'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const FULL_EVENT_FIXTURE = {
  id: 'event-abc-001',
  properties: {
    'Event Name': { title: [{ plain_text: 'SAGIE Annual Summit' }] },
    'Event Date': { date: { start: '2024-09-20' } },
    Type: { select: { name: 'SAGIE Event' } },
    Format: { select: { name: 'In-Person' } },
    Status: { select: { name: 'Confirmed' } },
    Venue: { rich_text: [{ plain_text: 'Tel Aviv Convention Center' }] },
    Description: { rich_text: [{ plain_text: 'A flagship annual summit.' }] },
    'Expected Attendees': { number: 200 },
    'Actual Attendees': { number: 185 },
    'Tier Target': { select: { name: 'Shaper' } },
    Speakers: { rich_text: [{ plain_text: 'Jane Doe, John Smith' }] },
    'Webinar Link': { url: 'https://zoom.us/j/123' },
    'Recording Link': { url: 'https://youtube.com/watch?v=abc' },
    'Photo Gallery': { url: 'https://photos.example.com/summit' },
    'Event Image': { url: 'https://example.com/summit.jpg' },
    'Registration Link': { url: 'https://example.com/register' },
    'More Info Link': { url: 'https://example.com/info' },
    'Recap Link': { url: '/blog/summit-recap' },
  },
}

// Fixture with datetime (has time portion)
const TIMED_EVENT_FIXTURE = {
  id: 'event-timed-003',
  properties: {
    'Event Name': { title: [{ plain_text: 'SAGIE Evening Meetup' }] },
    'Event Date': { date: { start: '2024-09-20T18:00:00.000+03:00' } },
    Type: { select: { name: 'SAGIE Event' } },
    Format: { select: { name: 'In-Person' } },
    Status: { select: { name: 'Confirmed' } },
    Venue: { rich_text: [{ plain_text: 'Tel Aviv Hub' }] },
    Description: { rich_text: [{ plain_text: 'An evening meetup.' }] },
    'Expected Attendees': { number: 50 },
    'Actual Attendees': { number: null },
    'Tier Target': { select: { name: 'Explorer' } },
    Speakers: { rich_text: [{ plain_text: 'Alice' }] },
    'Registration Link': { url: 'https://example.com/meetup-register' },
  },
}

const MINIMAL_EVENT_FIXTURE = {
  id: 'event-minimal-002',
  properties: {},
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('getUpcomingEvents', () => {
  const mockQuery = vi.mocked(notion.databases.query)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('maps full Notion page to SAGIEEvent with all fields', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_EVENT_FIXTURE] } as never)

    const events = await getUpcomingEvents()

    expect(events).toHaveLength(1)
    const event = events[0]!
    expect(event.id).toBe('event-abc-001')
    expect(event.name).toBe('SAGIE Annual Summit')
    expect(event.date).toBe('2024-09-20')
    expect(event.time).toBeNull() // date-only, no time portion
    expect(event.type).toBe('SAGIE Event')
    expect(event.format).toBe('In-Person')
    expect(event.status).toBe('Confirmed')
    expect(event.venue).toBe('Tel Aviv Convention Center')
    expect(event.description).toBe('A flagship annual summit.')
    expect(event.expectedAttendees).toBe(200)
    expect(event.actualAttendees).toBe(185)
    expect(event.tierTarget).toBe('Shaper')
    expect(event.chapter).toBeNull() // always null per mapping
    expect(event.speakers).toBe('Jane Doe, John Smith')
    expect(event.webinarLink).toBe('https://zoom.us/j/123')
    expect(event.recordingLink).toBe('https://youtube.com/watch?v=abc')
    expect(event.photoGallery).toBe('https://photos.example.com/summit')
    expect(event.eventImage).toBe('https://example.com/summit.jpg')
    expect(event.registrationLink).toBe('https://example.com/register')
    expect(event.moreInfoLink).toBe('https://example.com/info')
    expect(event.recapLink).toBe('/blog/summit-recap')
  })

  test('falls back to defaults when properties are missing', async () => {
    mockQuery.mockResolvedValueOnce({ results: [MINIMAL_EVENT_FIXTURE] } as never)

    const events = await getUpcomingEvents()

    expect(events).toHaveLength(1)
    const event = events[0]!
    expect(event.id).toBe('event-minimal-002')
    expect(event.name).toBe('Untitled')
    expect(event.date).toBeNull()
    expect(event.time).toBeNull()
    expect(event.type).toBeNull()
    expect(event.format).toBeNull()
    expect(event.status).toBe('Concept')
    expect(event.venue).toBeNull()
    expect(event.description).toBeNull()
    expect(event.expectedAttendees).toBeNull()
    expect(event.actualAttendees).toBeNull()
    expect(event.tierTarget).toBeNull()
    expect(event.chapter).toBeNull()
    expect(event.speakers).toBeNull()
    expect(event.webinarLink).toBeNull()
    expect(event.recordingLink).toBeNull()
    expect(event.photoGallery).toBeNull()
    expect(event.eventImage).toBeNull()
    expect(event.registrationLink).toBeNull()
    expect(event.moreInfoLink).toBeNull()
    expect(event.recapLink).toBeNull()
  })

  test('returns empty array when no results', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)

    const events = await getUpcomingEvents()

    expect(events).toEqual([])
  })

  test('maps registrationLink from Registration Link URL property', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_EVENT_FIXTURE] } as never)
    const events = await getUpcomingEvents()
    expect(events[0]!.registrationLink).toBe('https://example.com/register')
  })

  test('maps moreInfoLink from More Info Link URL property', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_EVENT_FIXTURE] } as never)
    const events = await getUpcomingEvents()
    expect(events[0]!.moreInfoLink).toBe('https://example.com/info')
  })

  test('maps recapLink from Recap Link URL property', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_EVENT_FIXTURE] } as never)
    const events = await getUpcomingEvents()
    expect(events[0]!.recapLink).toBe('/blog/summit-recap')
  })

  test('extracts time HH:mm from datetime Event Date', async () => {
    mockQuery.mockResolvedValueOnce({ results: [TIMED_EVENT_FIXTURE] } as never)
    const events = await getUpcomingEvents()
    expect(events[0]!.time).toBe('18:00')
  })

  test('returns time null when Event Date is date-only', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_EVENT_FIXTURE] } as never)
    const events = await getUpcomingEvents()
    expect(events[0]!.time).toBeNull()
  })
})

describe('getPastEvents', () => {
  const mockQuery = vi.mocked(notion.databases.query)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('maps pages correctly using the same mapEvent function', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_EVENT_FIXTURE] } as never)

    const events = await getPastEvents()

    expect(events).toHaveLength(1)
    const event = events[0]!
    expect(event.id).toBe('event-abc-001')
    expect(event.name).toBe('SAGIE Annual Summit')
    expect(event.date).toBe('2024-09-20')
    expect(event.status).toBe('Confirmed')
    expect(event.venue).toBe('Tel Aviv Convention Center')
  })

  test('falls back on missing properties', async () => {
    mockQuery.mockResolvedValueOnce({ results: [MINIMAL_EVENT_FIXTURE] } as never)

    const events = await getPastEvents()

    expect(events).toHaveLength(1)
    expect(events[0]!.name).toBe('Untitled')
    expect(events[0]!.status).toBe('Concept')
  })

  test('returns empty array when no results', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)

    const events = await getPastEvents()

    expect(events).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// escapeIcsText
// ---------------------------------------------------------------------------
describe('escapeIcsText', () => {
  test('escapes backslashes', () => {
    expect(escapeIcsText('a\\b')).toBe('a\\\\b')
  })

  test('escapes semicolons', () => {
    expect(escapeIcsText('a;b')).toBe('a\\;b')
  })

  test('escapes commas', () => {
    expect(escapeIcsText('a,b')).toBe('a\\,b')
  })

  test('escapes newlines', () => {
    expect(escapeIcsText('a\nb')).toBe('a\\nb')
  })

  test('escapes multiple special characters', () => {
    expect(escapeIcsText('Hello, world; foo\\bar\nnewline')).toBe(
      'Hello\\, world\\; foo\\\\bar\\nnewline'
    )
  })
})

// ---------------------------------------------------------------------------
// buildGoogleCalendarUrl
// ---------------------------------------------------------------------------
describe('buildGoogleCalendarUrl', () => {
  const BASE_EVENT = {
    id: 'event-abc-001',
    name: 'SAGIE Annual Summit',
    date: '2024-09-20',
    time: null,
    type: 'SAGIE Event' as const,
    format: 'In-Person',
    status: 'Confirmed' as const,
    venue: 'Tel Aviv Convention Center',
    description: 'A flagship annual summit.',
    expectedAttendees: 200,
    actualAttendees: 185,
    tierTarget: 'Shaper',
    chapter: null,
    speakers: 'Jane Doe, John Smith',
    webinarLink: null,
    recordingLink: null,
    photoGallery: null,
    eventImage: null,
    registrationLink: 'https://example.com/register',
    moreInfoLink: null,
    recapLink: null,
  }

  test('produces correct URL for all-day event (date-only format)', () => {
    const url = buildGoogleCalendarUrl(BASE_EVENT)
    expect(url).toContain('calendar.google.com/calendar/render')
    expect(url).toContain('action=TEMPLATE')
    // All-day: YYYYMMDD/YYYYMMDD+1 (next day as end)
    expect(url).toContain('20240920%2F20240921')
  })

  test('includes event name, venue, and description in URL', () => {
    const url = buildGoogleCalendarUrl(BASE_EVENT)
    expect(url).toContain('SAGIE+Annual+Summit')
    expect(url).toContain('Tel+Aviv+Convention+Center')
    expect(url).toContain('A+flagship+annual+summit.')
  })

  test('produces correct URL for timed event (datetime format)', () => {
    const timedEvent = { ...BASE_EVENT, date: '2024-09-20', time: '18:00' }
    const url = buildGoogleCalendarUrl(timedEvent)
    // Timed: YYYYMMDDTHHmmss/YYYYMMDDTHHmmss (start + 1 hour)
    expect(url).toContain('20240920T180000')
    expect(url).toContain('20240920T190000')
  })

  test('includes registration link in details when present', () => {
    const url = buildGoogleCalendarUrl(BASE_EVENT)
    expect(url).toContain('example.com%2Fregister')
  })
})

// ---------------------------------------------------------------------------
// buildOutlookCalendarUrl
// ---------------------------------------------------------------------------
describe('buildOutlookCalendarUrl', () => {
  const BASE_EVENT = {
    id: 'event-abc-001',
    name: 'SAGIE Annual Summit',
    date: '2024-09-20',
    time: null,
    type: 'SAGIE Event' as const,
    format: 'In-Person',
    status: 'Confirmed' as const,
    venue: 'Tel Aviv Convention Center',
    description: 'A flagship annual summit.',
    expectedAttendees: 200,
    actualAttendees: 185,
    tierTarget: 'Shaper',
    chapter: null,
    speakers: 'Jane Doe, John Smith',
    webinarLink: null,
    recordingLink: null,
    photoGallery: null,
    eventImage: null,
    registrationLink: null,
    moreInfoLink: null,
    recapLink: null,
  }

  test('produces correct Outlook URL with encoded params', () => {
    const url = buildOutlookCalendarUrl(BASE_EVENT)
    expect(url).toContain('outlook.live.com/calendar/0/action/compose')
    expect(url).toContain('SAGIE+Annual+Summit')
    expect(url).toContain('Tel+Aviv+Convention+Center')
  })

  test('includes subject, body, and location params', () => {
    const url = buildOutlookCalendarUrl(BASE_EVENT)
    expect(url).toContain('subject=')
    expect(url).toContain('body=')
    expect(url).toContain('location=')
  })
})

// ---------------------------------------------------------------------------
// buildIcsContent
// ---------------------------------------------------------------------------
describe('buildIcsContent', () => {
  const BASE_EVENT = {
    id: 'event-abc-001',
    name: 'SAGIE Annual Summit',
    date: '2024-09-20',
    time: null,
    type: 'SAGIE Event' as const,
    format: 'In-Person',
    status: 'Confirmed' as const,
    venue: 'Tel Aviv Convention Center',
    description: 'A flagship annual summit.',
    expectedAttendees: 200,
    actualAttendees: 185,
    tierTarget: 'Shaper',
    chapter: null,
    speakers: 'Jane Doe, John Smith',
    webinarLink: null,
    recordingLink: null,
    photoGallery: null,
    eventImage: null,
    registrationLink: 'https://example.com/register',
    moreInfoLink: null,
    recapLink: null,
  }

  test('produces valid ICS with VCALENDAR/VEVENT structure', () => {
    const ics = buildIcsContent(BASE_EVENT)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
  })

  test('uses VALUE=DATE format for all-day event', () => {
    const ics = buildIcsContent(BASE_EVENT)
    expect(ics).toContain('DTSTART;VALUE=DATE:20240920')
  })

  test('uses datetime format for timed event', () => {
    const timedEvent = { ...BASE_EVENT, time: '18:00', date: '2024-09-20' }
    const ics = buildIcsContent(timedEvent)
    expect(ics).toContain('DTSTART:20240920T180000Z')
  })

  test('includes UID with event id and sagie.co domain', () => {
    const ics = buildIcsContent(BASE_EVENT)
    expect(ics).toContain('UID:event-abc-001@sagie.co')
  })

  test('includes SUMMARY with event name', () => {
    const ics = buildIcsContent(BASE_EVENT)
    expect(ics).toContain('SUMMARY:SAGIE Annual Summit')
  })

  test('includes LOCATION with venue', () => {
    const ics = buildIcsContent(BASE_EVENT)
    expect(ics).toContain('LOCATION:Tel Aviv Convention Center')
  })

  test('includes registration link in DESCRIPTION when present', () => {
    const ics = buildIcsContent(BASE_EVENT)
    expect(ics).toContain('DESCRIPTION:')
    expect(ics).toContain('https://example.com/register')
  })

  test('uses CRLF line endings', () => {
    const ics = buildIcsContent(BASE_EVENT)
    expect(ics).toContain('\r\n')
  })
})
