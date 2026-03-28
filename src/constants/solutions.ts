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
  { label: 'All', value: 'All' },
  { label: 'Operations', value: 'Operations & Systems' },
  { label: 'Technology', value: 'Technology & Product' },
  { label: 'Strategy', value: 'Strategy & Advisory' },
  { label: 'Growth', value: 'Growth & Marketing' },
  { label: 'Finance', value: 'Finance & Legal' },
  { label: 'Talent', value: 'Talent & People' },
] as const
