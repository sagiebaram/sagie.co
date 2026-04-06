import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))
vi.mock('@/env/server', () => ({
  env: {
    NOTION_CHAPTERS_DB_ID: 'mock-chapters-db',
  },
}))
vi.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: vi.fn() },
  },
}))

import { getChapters } from '@/lib/chapters'
import { notion } from '@/lib/notion'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeChapterPage(id: string, props: any) {
  return { id, properties: props }
}

const FULL_CHAPTER_PROPS = {
  'Chapter Name': { title: [{ plain_text: 'Tel Aviv Chapter' }] },
  'Status': { select: { name: 'Active' } },
  'Description': { rich_text: [{ plain_text: 'Tech hub in the ME' }] },
  'Founded Year': { number: 2020 },
  'Latitude': { number: 32.0853 },
  'Longitude': { number: 34.7818 },
  'City': { rich_text: [{ plain_text: 'Tel Aviv' }] },
  'Region': { select: { name: 'Middle East' } },
  'Member Count': { number: 150 },
  'Chapter Lead': { rich_text: [{ plain_text: 'Alice' }] },
  'Waitlist URL': { url: 'https://sagie.co/waitlist/tlv' },
  'Chapter URL': { url: 'https://sagie.co/chapters/tlv' },
  'Display Order': { number: 1 },
}

const MINIMAL_CHAPTER_PROPS = {
  'Chapter Name': { title: [] }, // empty title
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('getChapters', () => {
  const mockQuery = vi.mocked(notion.databases.query)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns chapters with full properties mapped', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [makeChapterPage('chap-1', FULL_CHAPTER_PROPS)],
    } as never)

    const chapters = await getChapters()
    expect(chapters).toHaveLength(1)
    
    const chap = chapters[0]!
    expect(chap.id).toBe('chap-1')
    expect(chap.name).toBe('Tel Aviv Chapter')
    expect(chap.status).toBe('Active')
    expect(chap.description).toBe('Tech hub in the ME')
    expect(chap.foundedYear).toBe(2020)
    expect(chap.latitude).toBe(32.0853)
    expect(chap.longitude).toBe(34.7818)
    expect(chap.city).toBe('Tel Aviv')
    expect(chap.region).toBe('Middle East')
    expect(chap.memberCount).toBe(150)
    expect(chap.chapterLead).toBe('Alice')
    expect(chap.waitlistUrl).toBe('https://sagie.co/waitlist/tlv')
    expect(chap.chapterUrl).toBe('https://sagie.co/chapters/tlv')
    expect(chap.displayOrder).toBe(1)
  })

  test('falls back to defaults when properties are missing or empty', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [makeChapterPage('chap-2', MINIMAL_CHAPTER_PROPS)],
    } as never)

    const chapters = await getChapters()
    expect(chapters).toHaveLength(1)
    
    const chap = chapters[0]!
    expect(chap.name).toBe('Unnamed Chapter')
    expect(chap.status).toBe('Planned')
    expect(chap.description).toBeNull()
    expect(chap.foundedYear).toBeNull()
    expect(chap.latitude).toBeNull()
    expect(chap.longitude).toBeNull()
    expect(chap.city).toBeNull()
    expect(chap.region).toBeNull()
    expect(chap.memberCount).toBeNull()
    expect(chap.chapterLead).toBeNull()
    expect(chap.waitlistUrl).toBeNull()
    expect(chap.chapterUrl).toBeNull()
    expect(chap.displayOrder).toBe(999)
  })

  test('handles unknown status by falling back to "Planned"', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [
        makeChapterPage('chap-3', {
          ...FULL_CHAPTER_PROPS,
          'Status': { select: { name: 'Unknown Status' } },
        }),
      ],
    } as never)

    const chapters = await getChapters()
    expect(chapters[0]!.status).toBe('Planned')
  })

  test('returns empty array when no chapters are found', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)
    const chapters = await getChapters()
    expect(chapters).toEqual([])
  })
})
