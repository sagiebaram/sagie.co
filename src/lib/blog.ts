import { notion } from './notion'
import { NotionToMarkdown } from 'notion-to-md'

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

export async function getAllPosts(): Promise<BlogPost[]> {
  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_BLOG_DB_ID!,
    filter: { property: 'Status', select: { equals: 'Published' } },
    sorts: [{ property: 'Publish Date', direction: 'descending' }],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.results.map((page: any) => {
    const p = page.properties
    return {
      id: page.id,
      title: p['Title']?.title?.[0]?.plain_text ?? 'Untitled',
      slug: p['Slug']?.rich_text?.[0]?.plain_text ?? page.id,
      category: p['Category']?.select?.name ?? 'Ecosystem',
      excerpt: p['Excerpt']?.rich_text?.[0]?.plain_text ?? '',
      author: p['Author']?.rich_text?.[0]?.plain_text ?? 'Sagie Baram',
      authorType: p['Author Type']?.select?.name ?? 'Sagie',
      coverImage: p['Cover Image']?.url ?? null,
      featured: p['Featured']?.checkbox ?? false,
      publishDate: p['Publish Date']?.date?.start ?? null,
      readTime: p['Read Time']?.number ?? 3,
    }
  })
}

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
