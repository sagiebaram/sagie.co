import type { Persona } from '@/types'

export const PERSONAS: readonly Persona[] = [
  {
    name: 'Founders',
    line: 'Warm introductions to investors and operators who skip the cold outreach.',
    expanded: 'Access to investors, operators and ecosystem builders. Introductions that skip the cold outreach. Your vision will be seen, shaped and improved by the collective.',
    frontLabel: 'The vision',
    backLabel: 'The value',
  },
  {
    name: 'Investors',
    line: 'Curated deal flow. Vetted relationships before they reach you.',
    expanded: 'Curated deal flow. Warm introductions. The relationships are vetted before they reach you.',
    frontLabel: 'The thesis',
    backLabel: 'The access',
  },
  {
    name: 'Operators',
    line: 'Connections to founders who need what you know how to build.',
    expanded: 'A network that recognizes the execution layer. Connections to founders who need what you know. A community where what you build matters.',
    frontLabel: 'The role',
    backLabel: 'The network',
  },
  {
    name: 'Ecosystem Builders',
    line: 'A system designed to amplify cross-city connections you already make.',
    expanded: 'A system designed to amplify what you already do naturally. Cross-city connections. A collective that builds together.',
    frontLabel: 'The instinct',
    backLabel: 'The system',
  },
  {
    name: 'Academics',
    line: 'Direct access to builders who can take your research somewhere real.',
    expanded: 'Direct access to founders, operators and builders who can take your research somewhere. A bridge between knowledge and application.',
    frontLabel: 'The research',
    backLabel: 'The bridge',
  },
  {
    name: 'Partners',
    line: 'Vetted talent, services, and a community that actually collaborates.',
    expanded: 'Vetted talent, services, deal flow, and a community that actually collaborates.',
    frontLabel: 'The alignment',
    backLabel: 'The ecosystem',
  },
] as const
