import type { Persona } from '@/types'

export const PERSONAS: readonly Persona[] = [
  { name: 'Founders', line: 'Building a company, a product or an idea that could change something real.' },
  { name: 'Investors', line: 'Looking for people worth backing, not just deals and numbers.' },
  { name: 'Operators', line: 'The people who build the systems everything else depends on.' },
  { name: 'Ecosystem Builders', line: "Connecting people, resources and ideas \u2014 because that\u2019s just how you think." },
  { name: 'Academics', line: 'Turning research and knowledge into real-world impact.' },
  { name: 'Partners', line: 'Building with the ecosystem, not just around it.' },
] as const
