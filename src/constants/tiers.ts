import type { Tier } from '@/types'

export const TIERS: readonly Tier[] = [
  {
    name: 'Explorer',
    tag: 'Where it starts',
    desc: "You found the ecosystem. You\u2019re building context, showing up, and demonstrating alignment with what this is about.",
    cta: 'Apply to Join \u2192',
    ctaActive: true,
  },
  {
    name: 'Builder \u2605',
    tag: 'Earned',
    desc: "You consistently show up and create value for others. The community feels the difference you make. That\u2019s how you get here.",
    cta: 'This is earned \u2192',
    ctaActive: false,
  },
  {
    name: 'Shaper',
    tag: 'Invite only',
    desc: 'The inner circle. An invitation extended when the time is right \u2014 not applied for, not purchased. Never rushed.',
    cta: 'By invitation \u2192',
    ctaActive: false,
  },
] as const
