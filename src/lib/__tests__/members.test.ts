import { vi, describe, test, expect, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))
vi.mock('@/env/server', () => ({
  env: {
    NOTION_MEMBER_DB_ID: 'mock-member-db',
    NOTION_CHAPTERS_DB_ID: 'mock-chapters-db',
    NOTION_BLOG_DB_ID: 'mock-blog-db',
    NOTION_TOKEN: 'mock-token',
  },
}))
vi.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: vi.fn() },
  },
}))

import { getMemberCities, CITY_COORDS } from '@/lib/members'
import { notion } from '@/lib/notion'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeMemberPage(id: string, location: string | null) {
  return {
    id,
    properties: {
      Location: location
        ? { select: { name: location } }
        : { select: null },
    },
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('CITY_COORDS', () => {
  test('contains expected cities', () => {
    expect(CITY_COORDS).toHaveProperty('miami')
    expect(CITY_COORDS).toHaveProperty('tel aviv')
    expect(CITY_COORDS).toHaveProperty('dallas')
    expect(CITY_COORDS).toHaveProperty('singapore')
    expect(CITY_COORDS).toHaveProperty('dubai')
    expect(CITY_COORDS).toHaveProperty('new york')
    expect(CITY_COORDS).toHaveProperty('london')
  })

  test('miami has correct coordinates', () => {
    expect(CITY_COORDS['miami']!.lat).toBeCloseTo(25.7617)
    expect(CITY_COORDS['miami']!.lng).toBeCloseTo(-80.1918)
  })

  test('tel aviv has correct coordinates', () => {
    expect(CITY_COORDS['tel aviv']!.lat).toBeCloseTo(32.0853)
    expect(CITY_COORDS['tel aviv']!.lng).toBeCloseTo(34.7818)
  })
})

describe('getMemberCities', () => {
  const mockQuery = vi.mocked(notion.databases.query)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('groups members by location and returns CityData array', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [
        makeMemberPage('m1', 'Miami'),
        makeMemberPage('m2', 'Miami'),
        makeMemberPage('m3', 'Tel Aviv'),
      ],
    } as never)

    const cities = await getMemberCities()

    expect(cities).toHaveLength(2)

    const miami = cities.find((c) => c.name === 'Miami')
    expect(miami).toBeDefined()
    expect(miami!.members).toBe(2)
    expect(miami!.isChapter).toBe(false)
    expect(miami!.lat).toBeCloseTo(25.7617)
    expect(miami!.lng).toBeCloseTo(-80.1918)

    const tlv = cities.find((c) => c.name === 'Tel Aviv')
    expect(tlv).toBeDefined()
    expect(tlv!.members).toBe(1)
  })

  test('skips members whose location is not in CITY_COORDS lookup', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [
        makeMemberPage('m1', 'Miami'),
        makeMemberPage('m2', 'Atlantis'), // not in CITY_COORDS
        makeMemberPage('m3', 'Unknown City'), // not in CITY_COORDS
      ],
    } as never)

    const cities = await getMemberCities()

    expect(cities).toHaveLength(1)
    expect(cities[0]!.name).toBe('Miami')
  })

  test('skips members with null location', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [
        makeMemberPage('m1', 'Miami'),
        makeMemberPage('m2', null),
      ],
    } as never)

    const cities = await getMemberCities()

    expect(cities).toHaveLength(1)
    expect(cities[0]!.name).toBe('Miami')
  })

  test('returns empty array when Notion query returns no results', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)

    const cities = await getMemberCities()

    expect(cities).toEqual([])
  })

  test('CityData has required fields with correct types', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [makeMemberPage('m1', 'Miami')],
    } as never)

    const cities = await getMemberCities()

    expect(cities).toHaveLength(1)
    const city = cities[0]!
    expect(typeof city.id).toBe('string')
    expect(typeof city.name).toBe('string')
    expect(typeof city.lat).toBe('number')
    expect(typeof city.lng).toBe('number')
    expect(typeof city.members).toBe('number')
    expect(typeof city.isChapter).toBe('boolean')
  })

  test('uses case-insensitive matching for location names', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [
        makeMemberPage('m1', 'MIAMI'),
        makeMemberPage('m2', 'miami'),
        makeMemberPage('m3', 'Miami'),
      ],
    } as never)

    const cities = await getMemberCities()

    expect(cities).toHaveLength(1)
    expect(cities[0]!.members).toBe(3)
  })
})
