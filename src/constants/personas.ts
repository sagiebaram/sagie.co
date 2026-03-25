import type { Persona } from '@/types'

export const PERSONAS: readonly Persona[] = [
  {
    name: 'Founders',
    line: 'Building a company, a product or an idea that could change something real.',
    expanded: 'Access to investors, operators and ecosystem builders. Introductions that skip the cold outreach. Your vision will be seen, shaped and improved by the collective.',
    frontLabel: 'The vision',
    backLabel: 'The value',
  },
  {
    name: 'Investors',
    line: 'Looking for people worth backing, not just deals and numbers.',
    expanded: 'Curated deal flow. Warm introductions. The relationships are vetted before they reach you.',
    frontLabel: 'The thesis',
    backLabel: 'The access',
  },
  {
    name: 'Operators',
    line: 'The people who build the systems everything else depends on.',
    expanded: 'A network that recognizes the execution layer. Connections to founders who need what you know. A community where what you build matters.',
    frontLabel: 'The role',
    backLabel: 'The network',
  },
  {
    name: 'Ecosystem Builders',
    line: 'Connecting people, resources and ideas \u2014 because that\u2019s just how you think.',
    expanded: 'A system designed to amplify what you already do naturally. Cross-city connections. A collective that builds together.',
    frontLabel: 'The instinct',
    backLabel: 'The system',
  },
  {
    name: 'Academics',
    line: 'Turning research and knowledge into real-world impact.',
    expanded: 'Direct access to founders, operators and builders who can take your research somewhere. A bridge between knowledge and application.',
    frontLabel: 'The research',
    backLabel: 'The bridge',
  },
  {
    name: 'Partners',
    line: 'Organizations, sponsors and communities that believe in the mission.',
    expanded: 'Vetted talent, services, deal flow, and a community that actually collaborates.',
    frontLabel: 'The alignment',
    backLabel: 'The ecosystem',
  },
] as const
