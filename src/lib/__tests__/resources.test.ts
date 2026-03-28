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

import { getResources } from '@/lib/resources'
import { notion } from '@/lib/notion'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const FULL_RESOURCE_FIXTURE = {
  id: 'resource-abc-001',
  properties: {
    'Resource Name': { title: [{ plain_text: 'YC Startup School' }] },
    Category: { select: { name: 'Accelerators' } },
    Description: { rich_text: [{ plain_text: 'Free online program from Y Combinator.' }] },
    URL: { url: 'https://startupschool.org' },
    Location: { rich_text: [{ plain_text: 'Remote' }] },
    Tags: { rich_text: [{ plain_text: 'Early-stage, Founders' }] },
    Source: { select: { name: 'Curated' } },
    Featured: { checkbox: true },
  },
}

const MINIMAL_RESOURCE_FIXTURE = {
  id: 'resource-minimal-002',
  properties: {},
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('getResources', () => {
  const mockQuery = vi.mocked(notion.databases.query)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('maps full Notion page to Resource with all fields', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_RESOURCE_FIXTURE] } as never)

    const resources = await getResources()

    expect(resources).toHaveLength(1)
    const resource = resources[0]
    expect(resource.id).toBe('resource-abc-001')
    expect(resource.name).toBe('YC Startup School')
    expect(resource.category).toBe('Accelerators')
    expect(resource.description).toBe('Free online program from Y Combinator.')
    expect(resource.url).toBe('https://startupschool.org')
    expect(resource.location).toBe('Remote')
    expect(resource.bestFor).toBe('Early-stage, Founders')
    expect(resource.source).toBe('Curated')
    expect(resource.featured).toBe(true)
  })

  test('falls back to defaults when properties are missing', async () => {
    mockQuery.mockResolvedValueOnce({ results: [MINIMAL_RESOURCE_FIXTURE] } as never)

    const resources = await getResources()

    expect(resources).toHaveLength(1)
    const resource = resources[0]
    expect(resource.id).toBe('resource-minimal-002')
    expect(resource.name).toBe('')
    expect(resource.category).toBe('Community')
    expect(resource.description).toBe('')
    expect(resource.url).toBeNull()
    expect(resource.location).toBeNull()
    expect(resource.bestFor).toBeNull()
    expect(resource.source).toBe('Curated')
    expect(resource.featured).toBe(false)
  })

  test('returns empty array when no results', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)

    const resources = await getResources()

    expect(resources).toEqual([])
  })
})
