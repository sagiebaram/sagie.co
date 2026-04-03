import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'
import { getTitleProperty, getTextProperty, getSelectProperty, getUrlProperty, getCheckboxProperty } from './notion-utils'

export interface Resource {
  id: string
  name: string
  category: 'Accelerators' | 'Incubators' | 'Internships' | 'Providers' | 'Co-working' | 'Community'
  description: string
  url: string | null
  location: string | null
  bestFor: string | null
  source: 'Curated' | 'Community'
  featured: boolean
}

export const getResources = unstable_cache(
  async (): Promise<Resource[]> => {
    const response = await notion.databases.query({
      database_id: env.NOTION_RESOURCES_DB_ID,
      filter: { property: 'Status', select: { equals: 'Published' } },
      sorts: [{ property: 'Featured', direction: 'descending' }],
    })

     
    return response.results.map((page: any) => {
      const p = page.properties
      const id = page.id
      return {
        id,
        name: getTitleProperty(p, 'Resource Name', id, ''),
        category: getSelectProperty(p, 'Category', id, 'Community') as Resource['category'],
        description: getTextProperty(p, 'Description', id, ''),
        url: getUrlProperty(p, 'URL', id),
        location: getTextProperty(p, 'Location', id, '') || null,
        bestFor: getTextProperty(p, 'Tags', id, '') || null,
        source: getSelectProperty(p, 'Source', id, 'Curated') as Resource['source'],
        featured: getCheckboxProperty(p, 'Featured', id),
      }
    })
  },
  ['notion:resources:index'],
  { revalidate: 21600, tags: ['notion:resources'] }
)
