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

import { getSolutionProviders } from '@/lib/solutions'
import { notion } from '@/lib/notion'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const FULL_SOLUTION_FIXTURE = {
  id: 'solution-abc-001',
  properties: {
    'Provider Name': { title: [{ plain_text: 'John Doe' }] },
    Category: { select: { name: 'Legal' } },
    Bio: { rich_text: [{ plain_text: 'Experienced startup lawyer.' }] },
    'Services Offered': { rich_text: [{ plain_text: 'Contract drafting, term sheets.' }] },
    Website: { url: 'https://johndoe.law' },
    'Member Tier': { select: { name: 'Shaper' } },
    Featured: { checkbox: true },
  },
}

const MINIMAL_SOLUTION_FIXTURE = {
  id: 'solution-minimal-002',
  properties: {},
}

const SINGLE_WORD_NAME_FIXTURE = {
  id: 'solution-single-003',
  properties: {
    'Provider Name': { title: [{ plain_text: 'Madonna' }] },
    Category: { select: { name: 'Creative' } },
    Bio: { rich_text: [{ plain_text: 'Solo artist.' }] },
    'Services Offered': { rich_text: [{ plain_text: 'Music production.' }] },
    Website: { url: null },
    'Member Tier': { select: { name: 'Builder' } },
    Featured: { checkbox: false },
  },
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('getSolutionProviders', () => {
  const mockQuery = vi.mocked(notion.databases.query)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('maps full Notion page to SolutionProvider with all fields', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_SOLUTION_FIXTURE] } as never)

    const providers = await getSolutionProviders()

    expect(providers).toHaveLength(1)
    const provider = providers[0]!
    expect(provider.id).toBe('solution-abc-001')
    expect(provider.name).toBe('John Doe')
    expect(provider.initials).toBe('JD')
    expect(provider.category).toBe('Legal')
    expect(provider.bio).toBe('Experienced startup lawyer.')
    expect(provider.servicesOffered).toBe('Contract drafting, term sheets.')
    expect(provider.website).toBe('https://johndoe.law')
    expect(provider.memberTier).toBe('Shaper')
    expect(provider.featured).toBe(true)
  })

  test('computes initials from provider name (two-word name -> first letters)', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_SOLUTION_FIXTURE] } as never)

    const providers = await getSolutionProviders()

    expect(providers[0]!.initials).toBe('JD') // "John Doe" -> "J" + "D"
  })

  test('computes initials for single-word name', async () => {
    mockQuery.mockResolvedValueOnce({ results: [SINGLE_WORD_NAME_FIXTURE] } as never)

    const providers = await getSolutionProviders()

    expect(providers[0]!.name).toBe('Madonna')
    expect(providers[0]!.initials).toBe('M') // single word -> only first letter
  })

  test('falls back to defaults when properties are missing', async () => {
    mockQuery.mockResolvedValueOnce({ results: [MINIMAL_SOLUTION_FIXTURE] } as never)

    const providers = await getSolutionProviders()

    expect(providers).toHaveLength(1)
    const provider = providers[0]!
    expect(provider.id).toBe('solution-minimal-002')
    expect(provider.name).toBe('Community Member')
    expect(provider.initials).toBe('CM') // "Community Member" -> "C" + "M"
    expect(provider.category).toBe('')
    expect(provider.bio).toBe('')
    expect(provider.servicesOffered).toBe('')
    expect(provider.website).toBeNull()
    expect(provider.memberTier).toBe('Builder')
    expect(provider.featured).toBe(false)
  })

  test('returns empty array when no results', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)

    const providers = await getSolutionProviders()

    expect(providers).toEqual([])
  })
})
