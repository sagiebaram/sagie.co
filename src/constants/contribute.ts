/**
 * Copy for /contribute (v1, revised 04-11 post-review).
 *
 * This revision drops the Pillars / CTA banner / form sections entirely and
 * expands the Ways-to-Contribute card bodies to 2–3 sentences each per
 * Sagie's 04-11 direction. Hero, ticker, and How It Works copy stay the same.
 */

// ─── META ─────────────────────────────────────────────────────────────

export const CONTRIBUTE_METADATA = {
  title: 'Contribute',
  description:
    'SAGIE runs on people — their time, capital, networks, and expertise. Every contribution shapes a stronger ecosystem. Pick your entry point.',
} as const

// ─── HERO (unchanged copy, layout matches pillar pages) ───────────────

export const CONTRIBUTE_HERO = {
  label: 'sagie.co / contribute',
  subtitle:
    'SAGIE runs on people — their time, capital, networks, and expertise. Every contribution shapes a stronger ecosystem. Pick your entry point.',
  ctaPrimary: { label: 'See All Ways to Contribute', href: '#ways' },
  ctaGhost: { label: 'Become a Member First', href: '/apply' },
} as const

// ─── TICKER ───────────────────────────────────────────────────────────

export const CONTRIBUTE_TICKER_ITEMS = [
  'Time',
  'Capital',
  'Network',
  'Skills',
  'Space',
  'Sponsorship',
  'Mentorship',
  'Research',
  'Ideas',
] as const

// ─── WAYS TO CONTRIBUTE (revised header) ──────────────────────────────

export const CONTRIBUTE_WAYS_SECTION = {
  eyebrow: 'Ways to Contribute',
  titleLines: ['Find Your Way In.'] as const,
  desc:
    'Five forms of contribution. Infinite combinations. Pick the one that fits where you are right now — you can always add more later.',
} as const

// ─── 6 CARDS (revised bodies) ─────────────────────────────────────────
// Tint colors per mockup:
//   Time    + Skills  = gold       #C9A84C
//   Capital + Space   = ECO green  #7A9E7E
//   Network           = Solutions  #6B9EC0
//   Sponsorship       = Ventures   #8A8A8A
// All card CTAs route to /apply (form deferred to a future sprint).

export type ContributeAccent = 'gold' | 'eco' | 'solutions' | 'ventures'

export interface ContributeCard {
  readonly id: string
  readonly tag: string
  readonly title: string
  readonly body: string
  readonly link: string
  readonly accent: ContributeAccent
}

export const CONTRIBUTE_CARDS: readonly ContributeCard[] = [
  {
    id: 'time',
    tag: 'Time',
    title: 'Volunteer Your Time',
    body:
      'Lead a workshop. Help run an event. Moderate a session. Your hours become momentum — and the fastest way to get known inside the community.',
    link: 'Apply to volunteer',
    accent: 'gold',
  },
  {
    id: 'capital',
    tag: 'Capital',
    title: 'Invest in the Ecosystem',
    body:
      "Support SAGIE ECO through donations that fund youth programs and chapter development. Or co-invest alongside SAGIE Ventures in the founders building what's next.",
    link: 'Explore investment paths',
    accent: 'eco',
  },
  {
    id: 'network',
    tag: 'Network',
    title: 'Open Your Network',
    body:
      'Make a warm intro. Connect a founder to a funder. Bridge two people who should know each other. The highest-leverage contribution almost always costs you one email.',
    link: 'Submit an introduction',
    accent: 'solutions',
  },
  {
    id: 'skills',
    tag: 'Skills',
    title: 'Share Your Expertise',
    body:
      'Mentor a builder. Run an AMA. Contribute a template, a playbook, or a hard-won lesson to the SAGIE knowledge base. Teach what you wish someone had taught you earlier.',
    link: 'Offer your skills',
    accent: 'gold',
  },
  {
    id: 'sponsorship',
    tag: 'Sponsorship',
    title: 'Sponsor an Event or Program',
    body:
      'Put your brand inside SAGIE activations. Align with community-first events across Miami and beyond — the kind of programming that earns goodwill, not impressions.',
    link: 'View sponsor packages',
    accent: 'ventures',
  },
  {
    id: 'space',
    tag: 'Space',
    title: 'Host a SAGIE Activation',
    body:
      'Have a venue, an office, or a rooftop? Open it for the community. You provide the room — we handle the programming, the outreach, and the turnout.',
    link: 'Offer your space',
    accent: 'eco',
  },
] as const

export const CONTRIBUTE_ACCENT_HEX: Record<ContributeAccent, string> = {
  gold: '#C9A84C',
  eco: '#7A9E7E',
  solutions: '#6B9EC0',
  ventures: '#8A8A8A',
}

// ─── HOW IT WORKS (copy unchanged — only render bug was the issue) ────

export const CONTRIBUTE_HOW_SECTION = {
  eyebrow: 'Process',
  title: 'How It Works',
  desc: 'Four steps from intent to impact.',
} as const

export interface ContributeStep {
  readonly num: string
  readonly title: string
  readonly body: string
}

export const CONTRIBUTE_STEPS: readonly ContributeStep[] = [
  {
    num: '01',
    title: 'Choose Your Form',
    body: 'Pick the contribution type that matches where you are. All forms are welcome.',
  },
  {
    num: '02',
    title: 'Submit Intent',
    body: 'Short intake — no lengthy forms. We ask only what we need to route you correctly.',
  },
  {
    num: '03',
    title: 'Get Connected',
    body: 'Sagie or a chapter lead follows up within 72 hours to align on fit and scope.',
  },
  {
    num: '04',
    title: 'Create Impact',
    body: "You're in. Your contribution activates inside the ecosystem in real time.",
  },
] as const
