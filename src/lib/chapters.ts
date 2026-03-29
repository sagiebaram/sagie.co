import 'server-only'
import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await notion.databases.query({
      database_id: env.NOTION_CHAPTERS_DB_ID,
      sorts: [{ property: 'Display Order', direction: 'ascending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => {
      const p = page.properties
      const statusRaw: string = p['Status']?.select?.name ?? 'Planned'
      const status: Chapter['status'] =
        statusRaw === 'Active' || statusRaw === 'Coming Soon' || statusRaw === 'Planned'
          ? (statusRaw as Chapter['status'])
          : 'Planned'

      return {
        id: page.id,
        name: p['Chapter Name']?.title?.[0]?.plain_text ?? 'Unnamed Chapter',
        status,
        description:
          p['Description']?.rich_text?.map((b: any) => b.plain_text).join('') || null,
        foundedYear: p['Founded Year']?.number ?? null,
        latitude: p['Latitude']?.number ?? null,
        longitude: p['Longitude']?.number ?? null,
        city: p['City']?.rich_text?.[0]?.plain_text ?? null,
        region: p['Region']?.select?.name ?? null,
        memberCount: p['Member Count']?.number ?? null,
        chapterLead: p['Chapter Lead']?.rich_text?.[0]?.plain_text ?? null,
        waitlistUrl: p['Waitlist URL']?.url ?? null,
        chapterUrl: p['Chapter URL']?.url ?? null,
        displayOrder: p['Display Order']?.number ?? 999,
      }
    })
  },
  ['notion:chapters:index'],
  { revalidate: 3600, tags: ['notion:chapters'] }
)
