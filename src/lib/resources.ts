import { notion } from './notion'

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

export async function getResources(): Promise<Resource[]> {
  const response = await (notion as any).databases.query({
    database_id: process.env.NOTION_RESOURCES_DB_ID!,
    filter: { property: 'Status', select: { equals: 'Published' } },
    sorts: [{ property: 'Featured', direction: 'descending' }],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.results.map((page: any) => {
    const p = page.properties
    return {
      id: page.id,
      name: p['Resource Name']?.title?.[0]?.plain_text ?? '',
      category: p['Category']?.select?.name ?? 'Community',
      description: p['Description']?.rich_text?.[0]?.plain_text ?? '',
      url: p['URL']?.url ?? null,
      location: p['Location']?.rich_text?.[0]?.plain_text ?? null,
      bestFor: p['Tags']?.rich_text?.[0]?.plain_text ?? null,
      source: p['Source']?.select?.name ?? 'Curated',
      featured: p['Featured']?.checkbox ?? false,
    }
  })
}
