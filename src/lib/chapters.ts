import 'server-only'
import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'

export interface Chapter {
  id: string
  name: string
  status: 'Active' | 'Coming Soon' | 'Planned'
  location: string
  chapterLead: string | null
  description: string | null
  displayOrder: number
  detail: string | null
}

export const getChapters = unstable_cache(
  async (): Promise<Chapter[]> => {
    // Graceful degradation: if Chapters DB ID not configured, return empty array.
    // This means all cities appear as non-chapter dots until the Chapters DB is set up.
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
        name: p['Name']?.title?.[0]?.plain_text ?? 'Unnamed Chapter',
        status,
        location: p['Location']?.rich_text?.[0]?.plain_text ?? '',
        chapterLead: p['Chapter Lead']?.rich_text?.[0]?.plain_text ?? null,
        description:
          p['Description']?.rich_text?.map((b: any) => b.plain_text).join('') || null,
        displayOrder: p['Display Order']?.number ?? 999,
        detail:
          p['Detail']?.rich_text?.map((b: any) => b.plain_text).join('') || null,
      }
    })
  },
  ['notion:chapters:index'],
  { revalidate: 3600, tags: ['notion:chapters'] }
)
