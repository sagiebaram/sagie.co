import type { Chapter, SocialStat } from '@/types'

export const SITE = {
  name: 'SAGIE',
  tagline: 'Shape a Great Impact Everywhere',
  url: 'https://sagie.co',
  email: 'contact@sagie.co',
  founderUrl: 'https://sagiebaram.com',
} as const

export const METADATA = {
  title: 'SAGIE \u2014 Shape a Great Impact Everywhere',
  description:
    'A curated ecosystem for operators, founders & builders. Where founders and operators come to build cross-cultural impact.',
  ogDescription: 'A curated ecosystem for operators, founders & builders.',
} as const

export const NAV_LINKS = ['Solutions', 'ECO', 'Ventures', 'Events', 'Blog', 'Resources'] as const

export const HERO = {
  headingLines: [
    { text: 'A VISION.', colorClass: 'text-dim-decorative' },
    { text: 'A MOVEMENT.', colorClass: 'text-foreground-secondary' },
    { text: 'AN ECOSYSTEM.', colorClass: 'text-foreground whitespace-nowrap' },
  ],
  subtitle:
    'Where people and ideas connect. Where trust builds ecosystems. Where the collective creates impact.',
  primaryCta: 'Apply to Join \u2192',
} as const

export const BELIEF = {
  statements: [
    {
      text: "The world doesn\u2019t need more competition. ",
      highlight: 'It needs more collaboration.',
    },
    {
      text: 'People, ideas, and the collective belief that ',
      highlight: 'building together beats building alone.',
    },
    {
      text: 'Across borders. Across backgrounds. ',
      highlight: 'Across industries.',
    },
  ],
  closer: "It\u2019s already working.",
  tagline: '\u00B7 Shape a Great Impact Everywhere \u00B7',
} as const

export const SOCIAL_STATS: readonly SocialStat[] = [
  { value: '883+', label: 'Community Members' },
  { value: '1', label: 'Active Chapters' },
  { value: '5', label: 'Chapters in Progress' },
] as const

export const CHAPTERS: readonly Chapter[] = [
  {
    city: 'Miami',
    detail: 'Founded 2025 \u00B7 Active Chapter',
    status: 'live',
    badge: 'Live',
    action: { label: 'View Chapter \u2192', href: '#' },
  },
  {
    city: 'Tel Aviv',
    detail: 'Launching 2025',
    status: 'soon',
    badge: 'Coming Soon',
    action: { label: 'Join Waitlist \u2192', href: '#' },
  },
  {
    city: 'Texas',
    detail: 'Interest building',
    status: 'soon',
    badge: 'Coming Soon',
    action: { label: 'Join Waitlist \u2192', href: '#' },
  },
  {
    city: 'Singapore',
    detail: 'Interest building',
    status: 'soon',
    badge: 'Coming Soon',
    action: { label: 'Join Waitlist \u2192', href: '#' },
  },
  {
    city: 'New York',
    detail: 'Interest building',
    status: 'soon',
    badge: 'Coming Soon',
    action: { label: 'Join Waitlist \u2192', href: '#' },
  },
  {
    city: 'Dubai',
    detail: 'Interest building',
    status: 'soon',
    badge: 'Coming Soon',
    action: { label: 'Join Waitlist \u2192', href: '#' },
  },
] as const

export const CHAPTER_SECTION = {
  eyebrow: 'The chapters',
  heading: 'IS YOUR CITY\nON THE MAP?',
  body: "SAGIE ECO operates through local chapters \u2014 each one rooted in its city, connected to the global ecosystem. If your city isn\u2019t here yet, that\u2019s your invitation.",
  cta: 'Start a Chapter \u2192',
} as const

export const TIERS_EYEBROW = 'Tiers are earned, not purchased' as const

export const FOUNDER = {
  eyebrow: "Who\u2019s behind this",
  name: 'Sagie Baram',
  title: 'Ecosystem Architect \u00B7 Fractional Executive \u00B7 Startup Consultant',
  paragraphs: [
    'Community building started early. Gaming communities of 10, then 100, then 1,000+. The lesson learned then still drives everything today \u2014 shared vision and real engagement create something that lasts.',
    'That principle deepened through open source work. Trust, accountability, collaboration, transparency \u2014 not values on a wall, but an actual operating system for how people build together. The collective always outlasts the individual.',
    "SAGIE was built from that belief. Shaped by philosophies, by the people met along the way, by a neurodivergent mind that connects dots others don\u2019t see \u2014 ideas, people, industries, cultures.",
    "What you give is what you receive. That\u2019s not a tagline. It\u2019s what made all of this real.",
    'What started as a vision became a system. What started as a system became a movement.',
  ],
  link: 'Meet the founder \u2192 sagiebaram.com',
} as const

export const FAQ_EYEBROW = 'Common questions' as const

export const FINAL_CTA = {
  heading: 'A VISION.\nA MOVEMENT.\nAN ECOSYSTEM.',
  acronym: [
    { letter: 'S', rest: 'HAPE ' },
    { letter: 'A', rest: '' },
    { letter: ' ', rest: '' },
    { letter: 'G', rest: 'REAT ' },
    { letter: 'I', rest: 'MPACT ' },
    { letter: 'E', rest: 'VERYWHERE' },
  ],
  subtitle:
    'Where people and ideas connect. Where trust builds ecosystems.\nWhere the collective creates impact.',
  cta: 'Apply to Join \u2192',
} as const

export const FOOTER = {
  navigate: {
    label: 'Navigate',
    links: [
      { label: 'SAGIE Solutions', url: '/solutions' },
      { label: 'SAGIE ECO', url: '/eco' },
      { label: 'SAGIE Ventures', url: '/ventures' },
    ],
    founderLink: 'Work with Sagie \u2192',
  },
  follow: {
    label: 'Follow',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/company/sagie-co' },
      { label: 'Instagram', url: 'https://www.instagram.com/sagie.co/' },
    ],
  },
  contact: {
    label: 'Contact',
    links: ['Apply to Join', 'Start a Chapter'],
  },
  copyright: '\u00A9 2026 SAGIE \u00B7 All rights reserved \u00B7 Privacy Policy',
} as const
