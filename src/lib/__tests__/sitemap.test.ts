import { vi, describe, test, expect } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
}))
vi.mock('@/env/server', () => ({
  env: {
    NOTION_BLOG_DB_ID: 'mock-blog-db',
    NOTION_TOKEN: 'mock-token',
    NOTION_EVENT_DB_ID: 'mock-events-db',
    NOTION_RESOURCES_DB_ID: 'mock-resources-db',
    NOTION_SOLUTIONS_DB_ID: 'mock-solutions-db',
    NOTION_MEMBER_DB_ID: 'mock-member-db',
    NOTION_VENTURES_INTAKE_DB_ID: 'mock-ventures-db',
    ALLOWED_ORIGINS: 'http://localhost:3000',
  },
}))
vi.mock('@/lib/notion', () => ({
  notion: {
    databases: { query: vi.fn() },
  },
}))

vi.mock('@/lib/blog', () => ({
  getAllPosts: vi.fn(),
}))

import sitemap from '@/app/sitemap'
import { getAllPosts } from '@/lib/blog'

const mockGetAllPosts = vi.mocked(getAllPosts)

const STATIC_ROUTES = [
  'https://sagie.co',
  'https://sagie.co/blog',
  'https://sagie.co/events',
  'https://sagie.co/resources',
  'https://sagie.co/solutions',
  'https://sagie.co/apply',
  'https://sagie.co/apply/chapter',
  'https://sagie.co/apply/solutions',
  'https://sagie.co/apply/ventures',
  'https://sagie.co/suggest-event',
]

describe('sitemap()', () => {
  test('includes all 10 static routes', async () => {
    mockGetAllPosts.mockResolvedValueOnce([])

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    for (const route of STATIC_ROUTES) {
      expect(urls).toContain(route)
    }
    expect(urls.filter((u) => !u.includes('/blog/')).length).toBeGreaterThanOrEqual(10)
  })

  test('includes dynamic /blog/[slug] entries from getAllPosts()', async () => {
    mockGetAllPosts.mockResolvedValueOnce([
      {
        id: '1',
        title: 'First Post',
        slug: 'first-post',
        publishDate: '2024-06-15',
        category: 'Ecosystem',
        excerpt: '',
        author: 'Sagie',
        authorType: 'Sagie',
        coverImage: null,
        featured: false,
        readTime: 3,
      },
      {
        id: '2',
        title: 'Second Post',
        slug: 'second-post',
        publishDate: null,
        category: 'Spotlight',
        excerpt: '',
        author: 'Jane',
        authorType: 'Community Member',
        coverImage: null,
        featured: false,
        readTime: 5,
      },
    ])

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    expect(urls).toContain('https://sagie.co/blog/first-post')
    expect(urls).toContain('https://sagie.co/blog/second-post')
  })

  test('blog post with publishDate uses it as lastModified', async () => {
    mockGetAllPosts.mockResolvedValueOnce([
      {
        id: '1',
        title: 'Post With Date',
        slug: 'post-with-date',
        publishDate: '2024-06-15',
        category: 'Ecosystem',
        excerpt: '',
        author: 'Sagie',
        authorType: 'Sagie',
        coverImage: null,
        featured: false,
        readTime: 3,
      },
    ])

    const entries = await sitemap()
    const blogEntry = entries.find((e) => e.url === 'https://sagie.co/blog/post-with-date')

    expect(blogEntry).toBeDefined()
    expect(blogEntry?.lastModified).toBeInstanceOf(Date)
    expect((blogEntry?.lastModified as Date).toISOString()).toContain('2024-06-15')
  })

  test('does NOT include /admin/revalidate in sitemap', async () => {
    mockGetAllPosts.mockResolvedValueOnce([])

    const entries = await sitemap()
    const urls = entries.map((e) => e.url)

    expect(urls).not.toContain('https://sagie.co/admin/revalidate')
    expect(urls.some((u) => u.includes('/admin'))).toBe(false)
  })

  test('home page has priority 1.0', async () => {
    mockGetAllPosts.mockResolvedValueOnce([])

    const entries = await sitemap()
    const home = entries.find((e) => e.url === 'https://sagie.co')

    expect(home).toBeDefined()
    expect(home?.priority).toBe(1.0)
  })
})
