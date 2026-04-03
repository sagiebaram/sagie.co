import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'
import { getTitleProperty, getTextProperty, getSelectProperty, getUrlProperty, getCheckboxProperty } from './notion-utils'

export interface SolutionProvider {
  id: string
  name: string
  initials: string
  category: string
  bio: string
  servicesOffered: string
  website: string | null
  memberTier: 'Builder' | 'Shaper'
  featured: boolean
}

export const getSolutionProviders = unstable_cache(
  async (): Promise<SolutionProvider[]> => {
    const response = await notion.databases.query({
      database_id: env.NOTION_SOLUTIONS_DB_ID,
      filter: { property: 'Status', select: { equals: 'Active' } },
      sorts: [{ property: 'Featured', direction: 'descending' }],
    })

     
    return response.results.map((page: any) => {
      const p = page.properties
      const id = page.id
      const name = getTitleProperty(p, 'Provider Name', id, 'Community Member')
      const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? '')
        .join('')

      return {
        id,
        name,
        initials,
        category: getSelectProperty(p, 'Category', id, ''),
        bio: getTextProperty(p, 'Bio', id, ''),
        servicesOffered: getTextProperty(p, 'Services Offered', id, ''),
        website: getUrlProperty(p, 'Website', id),
        memberTier: getSelectProperty(p, 'Member Tier', id, 'Builder') as SolutionProvider['memberTier'],
        featured: getCheckboxProperty(p, 'Featured', id),
      }
    })
  },
  ['notion:solutions:index'],
  { revalidate: 43200, tags: ['notion:solutions'] }
)
