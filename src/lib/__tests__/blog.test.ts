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

import { getAllPosts } from '@/lib/blog'
import { notion } from '@/lib/notion'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const FULL_PAGE_FIXTURE = {
  id: 'page-abc-123',
  properties: {
    Title: { title: [{ plain_text: 'My Great Post' }] },
    Slug: { rich_text: [{ plain_text: 'my-great-post' }] },
    Category: { select: { name: 'Spotlight' } },
    Excerpt: { rich_text: [{ plain_text: 'A great excerpt.' }] },
    Author: { rich_text: [{ plain_text: 'Jane Doe' }] },
    'Author Type': { select: { name: 'Community Member' } },
    'Cover Image': { url: 'https://example.com/cover.jpg' },
    Featured: { checkbox: true },
    'Publish Date': { date: { start: '2024-06-15' } },
    'Read Time': { number: 7 },
  },
}

const MINIMAL_PAGE_FIXTURE = {
  id: 'page-minimal-456',
  properties: {},
}

const ANOTHER_PAGE_FIXTURE = {
  id: 'page-xyz-789',
  properties: {
    Title: { title: [{ plain_text: 'Another Post' }] },
    Slug: { rich_text: [{ plain_text: 'another-post' }] },
    Category: { select: { name: 'Ecosystem' } },
    Excerpt: { rich_text: [{ plain_text: '' }] },
    Author: { rich_text: [{ plain_text: 'Sagie Baram' }] },
    'Author Type': { select: { name: 'Sagie' } },
    'Cover Image': { url: null },
    Featured: { checkbox: false },
    'Publish Date': { date: { start: '2024-01-01' } },
    'Read Time': { number: 5 },
  },
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('getAllPosts', () => {
  const mockQuery = vi.mocked(notion.databases.query)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('maps full Notion page to BlogPost with all fields correctly', async () => {
    mockQuery.mockResolvedValueOnce({ results: [FULL_PAGE_FIXTURE] } as never)

    const posts = await getAllPosts()

    expect(posts).toHaveLength(1)
    const post = posts[0]!
    expect(post.id).toBe('page-abc-123')
    expect(post.title).toBe('My Great Post')
    expect(post.slug).toBe('my-great-post')
    expect(post.category).toBe('Spotlight')
    expect(post.excerpt).toBe('A great excerpt.')
    expect(post.author).toBe('Jane Doe')
    expect(post.authorType).toBe('Community Member')
    expect(post.coverImage).toBe('https://example.com/cover.jpg')
    expect(post.featured).toBe(true)
    expect(post.publishDate).toBe('2024-06-15')
    expect(post.readTime).toBe(7)
  })

  test('falls back to defaults when properties are missing', async () => {
    mockQuery.mockResolvedValueOnce({ results: [MINIMAL_PAGE_FIXTURE] } as never)

    const posts = await getAllPosts()

    expect(posts).toHaveLength(1)
    const post = posts[0]!
    expect(post.id).toBe('page-minimal-456')
    expect(post.title).toBe('Untitled')
    expect(post.slug).toBe('page-minimal-456') // falls back to page.id
    expect(post.category).toBe('Ecosystem')
    expect(post.excerpt).toBe('')
    expect(post.author).toBe('Sagie Baram')
    expect(post.authorType).toBe('Sagie')
    expect(post.coverImage).toBeNull()
    expect(post.featured).toBe(false)
    expect(post.publishDate).toBeNull()
    expect(post.readTime).toBe(3)
  })

  test('returns empty array when no results', async () => {
    mockQuery.mockResolvedValueOnce({ results: [] } as never)

    const posts = await getAllPosts()

    expect(posts).toEqual([])
  })

  test('maps multiple pages correctly', async () => {
    mockQuery.mockResolvedValueOnce({
      results: [FULL_PAGE_FIXTURE, ANOTHER_PAGE_FIXTURE],
    } as never)

    const posts = await getAllPosts()

    expect(posts).toHaveLength(2)
    expect(posts[0]!.title).toBe('My Great Post')
    expect(posts[1]!.title).toBe('Another Post')
    expect(posts[1]!.slug).toBe('another-post')
    expect(posts[1]!.readTime).toBe(5)
  })
})
