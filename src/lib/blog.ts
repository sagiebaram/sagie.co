import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'
import { NotionToMarkdown } from 'notion-to-md'
import { getTitleProperty, getTextProperty, getSelectProperty, getUrlProperty, getCheckboxProperty, getDateProperty, getNumberProperty } from './notion-utils'

const n2m = new NotionToMarkdown({ notionClient: notion })

export interface BlogPost {
  id: string
  title: string
  slug: string
  category: 'Personal' | 'Ecosystem' | 'Spotlight' | 'Event Recap' | 'Thought Leadership'
  excerpt: string
  author: string
  authorType: 'Sagie' | 'Community Member'
  coverImage: string | null
  featured: boolean
  publishDate: string | null
  readTime: number
}

export const getAllPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const response = await notion.databases.query({
      database_id: env.NOTION_BLOG_DB_ID,
      filter: { property: 'Status', select: { equals: 'Published' } },
      sorts: [{ property: 'Publish Date', direction: 'descending' }],
    })
     
    return response.results.map((page: any) => {
      const p = page.properties
      const id = page.id
      return {
        id,
        title: getTitleProperty(p, 'Title', id, 'Untitled'),
        slug: getTextProperty(p, 'Slug', id, page.id),
        category: getSelectProperty(p, 'Category', id, 'Ecosystem') as BlogPost['category'],
        excerpt: getTextProperty(p, 'Excerpt', id, ''),
        author: getTextProperty(p, 'Author', id, 'Sagie Baram'),
        authorType: getSelectProperty(p, 'Author Type', id, 'Sagie') as BlogPost['authorType'],
        coverImage: getUrlProperty(p, 'Cover Image', id),
        featured: getCheckboxProperty(p, 'Featured', id),
        publishDate: getDateProperty(p, 'Publish Date', id),
        readTime: getNumberProperty(p, 'Read Time', id, 3) ?? 3,
      }
    })
  },
  ['notion:blog:index'],
  { revalidate: 3600, tags: ['notion:blog'] }
)

export async function getPostBySlug(slug: string): Promise<(BlogPost & { markdown: string }) | null> {
  const posts = await getAllPosts()
  const post = posts.find(p => p.slug === slug)
  if (!post) return null

  try {
    const mdBlocks = await n2m.pageToMarkdown(post.id)
    const markdown = n2m.toMarkdownString(mdBlocks).parent ?? ''
    return { ...post, markdown }
  } catch {
    return { ...post, markdown: '' }
  }
}
