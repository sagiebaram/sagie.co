export interface SolutionProvider {
  id: string
  name: string
  initials: string
  category: SolutionCategory
  bio: string
  memberTier: 'Builder' | 'Shaper'
  website: string | null
  contactEmail: string | null
}

export type SolutionCategory =
  | 'Operations & Systems'
  | 'Strategy & Advisory'
  | 'Technology & Product'
  | 'Growth & Marketing'
  | 'Finance & Legal'
  | 'Talent & People'

export const SERVICE_CATEGORIES: {
  name: SolutionCategory
  description: string
}[] = [
  { name: 'Operations & Systems', description: 'Fractional ops leadership, workflow design, and internal tooling for early-stage teams.' },
  { name: 'Strategy & Advisory', description: 'Go-to-market planning, fundraise prep, and strategic positioning for founders.' },
  { name: 'Technology & Product', description: 'Full-stack engineering, product management, and technical architecture.' },
  { name: 'Growth & Marketing', description: 'Brand strategy, demand generation, content, and community-led growth.' },
  { name: 'Finance & Legal', description: 'Financial modeling, bookkeeping, compliance, and startup legal counsel.' },
  { name: 'Talent & People', description: 'Recruiting, people ops, culture design, and fractional HR leadership.' },
]

export const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Operations', value: 'Operations & Systems' },
  { label: 'Technology', value: 'Technology & Product' },
  { label: 'Strategy', value: 'Strategy & Advisory' },
  { label: 'Growth', value: 'Growth & Marketing' },
  { label: 'Finance', value: 'Finance & Legal' },
  { label: 'Talent', value: 'Talent & People' },
] as const

export const MOCK_PROVIDERS: SolutionProvider[] = [
  { id: '1', name: 'Community Member', initials: 'SB', category: 'Operations & Systems', bio: 'Fractional COO and systems architect. Builds operational infrastructure for early-stage startups.', memberTier: 'Builder', website: null, contactEmail: null },
  { id: '2', name: 'Community Member', initials: 'AM', category: 'Technology & Product', bio: 'Full-stack engineer with 8 years building products for startups and scale-ups.', memberTier: 'Builder', website: null, contactEmail: null },
  { id: '3', name: 'Community Member', initials: 'JR', category: 'Strategy & Advisory', bio: 'Startup advisor focused on go-to-market strategy and fundraise preparation.', memberTier: 'Shaper', website: null, contactEmail: null },
]
