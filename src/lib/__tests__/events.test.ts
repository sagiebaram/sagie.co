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

import { getUpcomingEvents, getPastEvents } from '@/lib/events'
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
    expect(event.time).toBeNull() // always null per mapping
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
  })

  test('returns empty array when no results', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)

    const events = await getUpcomingEvents()

    expect(events).toEqual([])
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
