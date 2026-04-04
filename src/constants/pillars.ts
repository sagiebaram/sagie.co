import type { Pillar } from '@/types'

export const PILLARS: readonly Pillar[] = [
  {
    word: 'ECO',
    subtitle: 'The Ecosystem of Communities',
    where: 'Where the movement lives.',
    desc: 'Events, value, cross-cultural connections \u2014 built on layers of trust, not transactions.',
  },
  {
    word: 'SOLUTIONS',
    subtitle: 'The Services We Offer',
    where: 'Where the ecosystem works.',
    desc: 'Operated by vetted community members, who offer expertise. Revenue flows back to fund the mission.',
  },
  {
    word: 'VENTURES',
    subtitle: 'The Portfolio of Impact',
    where: 'Where the impact scales.',
    desc: 'Companies, people and equity \u2014 an investment portfolio built around positive impact, innovation and influential movements.',
  },
] as const
