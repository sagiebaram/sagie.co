export interface Resource {
  id: string
  name: string
  category: 'Accelerators' | 'Incubators' | 'Internships' | 'Providers' | 'Co-working' | 'Community'
  description: string
  url: string
  location: string
  bestFor: string
  source: 'Curated' | 'Community'
  featured: boolean
}

export const MOCK_RESOURCES: Resource[] = [
  { id: '1', name: 'Y Combinator', category: 'Accelerators', description: 'The most influential startup accelerator globally. Invests in 200+ startups per batch, twice a year.', url: 'https://ycombinator.com', location: 'Global', bestFor: 'Early-stage startups seeking funding and network', source: 'Curated', featured: true },
  { id: '2', name: 'Techstars', category: 'Accelerators', description: 'Global accelerator network across 50+ cities. Mentorship-driven model with strong alumni network.', url: 'https://techstars.com', location: 'Global · 50+ cities', bestFor: 'Early-stage startups seeking mentorship and network', source: 'Curated', featured: false },
  { id: '3', name: 'Clerky', category: 'Providers', description: 'Legal paperwork built for startups — incorporation, SAFEs, equity. Used by YC companies.', url: 'https://clerky.com', location: 'Global · Online', bestFor: 'Founders needing legal infrastructure from day one', source: 'Curated', featured: false },
  { id: '4', name: 'WeWork', category: 'Co-working', description: 'Flexible co-working spaces in major cities globally. Day passes and monthly memberships.', url: 'https://wework.com', location: 'Global · Miami, New York, Tel Aviv + more', bestFor: 'Teams needing flexible office space without long leases', source: 'Curated', featured: false },
  { id: '5', name: 'On Deck', category: 'Community', description: 'Fellowship programs for founders and operators. Strong network of ambitious builders.', url: 'https://beondeck.com', location: 'Global · Online + in-person', bestFor: 'Founders and operators seeking high-quality peer networks', source: 'Curated', featured: false },
  { id: '6', name: 'Brex', category: 'Providers', description: 'Financial services built for startups — corporate cards, expense management, banking.', url: 'https://brex.com', location: 'Global · Online', bestFor: 'Startups needing financial infrastructure from day one', source: 'Community', featured: false },
  { id: '7', name: '500 Global', category: 'Accelerators', description: 'Early-stage venture fund and accelerator with a global portfolio of 2,500+ companies.', url: 'https://500.co', location: 'Global · Multiple cohorts', bestFor: 'Early-stage founders seeking funding and global network', source: 'Community', featured: false },
]
