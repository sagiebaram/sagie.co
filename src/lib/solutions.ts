import { notion } from './notion'

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

export async function getSolutionProviders(): Promise<SolutionProvider[]> {
  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_SOLUTIONS_DB_ID!,
    filter: { property: 'Status', select: { equals: 'Active' } },
    sorts: [{ property: 'Featured', direction: 'descending' }],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.results.map((page: any) => {
    const p = page.properties
    const name = p['Provider Name']?.title?.[0]?.plain_text ?? 'Community Member'
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase() ?? '')
      .join('')

    return {
      id: page.id,
      name,
      initials,
      category: p['Category']?.select?.name ?? '',
      bio: p['Bio']?.rich_text?.[0]?.plain_text ?? '',
      servicesOffered: p['Services Offered']?.rich_text?.[0]?.plain_text ?? '',
      website: p['Website']?.url ?? null,
      memberTier: p['Member Tier']?.select?.name ?? 'Builder',
      featured: p['Featured']?.checkbox ?? false,
    }
  })
}
