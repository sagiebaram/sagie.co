import 'server-only'
import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'
import { getTitleProperty, getTextProperty, getSelectProperty, getUrlProperty, getNumberProperty, getFullTextProperty } from './notion-utils'

export interface Chapter {
  id: string
  name: string
  status: 'Active' | 'Coming Soon' | 'Planned'
  description: string | null
  foundedYear: number | null
  latitude: number | null
  longitude: number | null
  city: string | null
  region: string | null
  memberCount: number | null
  chapterLead: string | null
  waitlistUrl: string | null
  chapterUrl: string | null
  displayOrder: number
}

export const getChapters = unstable_cache(
  async (): Promise<Chapter[]> => {
    if (!env.NOTION_CHAPTERS_DB_ID) {
      return []
    }

     
    const response = await notion.databases.query({
      database_id: env.NOTION_CHAPTERS_DB_ID,
      sorts: [{ property: 'Display Order', direction: 'ascending' }],
    })

     
    return response.results.map((page: any) => {
      const p = page.properties
      const id = page.id
      const statusRaw = getSelectProperty(p, 'Status', id, 'Planned')
      const status: Chapter['status'] =
        statusRaw === 'Active' || statusRaw === 'Coming Soon' || statusRaw === 'Planned'
          ? (statusRaw as Chapter['status'])
          : 'Planned'

      return {
        id,
        name: getTitleProperty(p, 'Chapter Name', id, 'Unnamed Chapter'),
        status,
        description: getFullTextProperty(p, 'Description', id),
        foundedYear: getNumberProperty(p, 'Founded Year', id),
        latitude: getNumberProperty(p, 'Latitude', id),
        longitude: getNumberProperty(p, 'Longitude', id),
        city: getTextProperty(p, 'City', id, '') || null,
        region: getSelectProperty(p, 'Region', id, '') || null,
        memberCount: getNumberProperty(p, 'Member Count', id),
        chapterLead: getTextProperty(p, 'Chapter Lead', id, '') || null,
        waitlistUrl: getUrlProperty(p, 'Waitlist URL', id),
        chapterUrl: getUrlProperty(p, 'Chapter URL', id),
        displayOrder: getNumberProperty(p, 'Display Order', id, 999) ?? 999,
      }
    })
  },
  ['notion:chapters:index'],
  { revalidate: 3600, tags: ['notion:chapters'] }
)
