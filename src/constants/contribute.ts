/**
 * Copy for /contribute.
 *
 * VERBATIM from .planning/mockups/contribute-page.html and contribution-form.html
 * per Sprint 04-11 Track 2 (6-card mockup, single privacy consent).
 * Do not paraphrase — every string here is authoritative for the page.
 */

// ─── META ─────────────────────────────────────────────────────────────

export const CONTRIBUTE_METADATA = {
  title: 'Contribute',
  description:
    'SAGIE runs on people — their time, capital, networks, and expertise. Every contribution shapes a stronger ecosystem. Pick your entry point.',
} as const

// ─── HERO (mockup lines 621–632) ──────────────────────────────────────

export const CONTRIBUTE_HERO = {
  label: 'sagie.co / contribute',
  headlineLines: ['BUILD', 'WITH', 'US'] as const,
  emphasisIndex: 2, // "US" renders with editorial <em> emphasis (gold stroke)
  subtitle:
    'SAGIE runs on people — their time, capital, networks, and expertise. Every contribution shapes a stronger ecosystem. Pick your entry point.',
  ctaPrimary: { label: 'See All Ways to Contribute', href: '#ways' },
  ctaGhost: { label: 'Become a Member First', href: '/apply' },
} as const

// ─── TICKER (mockup line 639) ─────────────────────────────────────────

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

// ─── WAYS TO CONTRIBUTE — section header (mockup lines 645–650) ───────

export const CONTRIBUTE_WAYS_SECTION = {
  eyebrow: 'Ways to Contribute',
  titleLines: ['Your Input.', 'Your Form.'] as const,
  desc:
    'No minimum. No gatekeeping. Contribute in the way that fits where you are right now.',
} as const

// ─── 6 CONTRIBUTION CARDS (mockup lines 654–716) ──────────────────────
// Tint colors per mockup:
//   Time    + Skills  = gold       #C9A84C
//   Capital + Space   = ECO green  #7A9E7E
//   Network           = Solutions  #6B9EC0
//   Sponsorship       = Ventures   #8A8A8A
// All card CTAs scroll to /contribute#form for this sprint.

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
      'Lead a workshop. Help run an event. Moderate a session. Your hours become momentum for the community.',
    link: 'Apply to volunteer',
    accent: 'gold',
  },
  {
    id: 'capital',
    tag: 'Capital',
    title: 'Invest in the Ecosystem',
    body:
      'Support SAGIE ECO through donations, or co-invest alongside SAGIE Ventures in emerging founders.',
    link: 'Explore investment paths',
    accent: 'eco',
  },
  {
    id: 'network',
    tag: 'Network',
    title: 'Open Your Network',
    body:
      'Make a warm intro. Connect a founder to a funder. Bridge two people who should know each other.',
    link: 'Submit an introduction',
    accent: 'solutions',
  },
  {
    id: 'skills',
    tag: 'Skills',
    title: 'Share Your Expertise',
    body:
      'Mentor a builder. Run an AMA. Contribute a resource to the SAGIE knowledge base.',
    link: 'Offer your skills',
    accent: 'gold',
  },
  {
    id: 'sponsorship',
    tag: 'Sponsorship',
    title: 'Sponsor an Event or Program',
    body:
      'Put your brand inside SAGIE activations. Align with community-first events across Miami and beyond.',
    link: 'View sponsor packages',
    accent: 'ventures',
  },
  {
    id: 'space',
    tag: 'Space',
    title: 'Host a SAGIE Activation',
    body:
      'Have a venue, office, or rooftop? Open it for the community. We handle the programming.',
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

// ─── HOW IT WORKS (mockup lines 724–751) ──────────────────────────────

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

// ─── WHERE IT GOES / PILLARS (mockup lines 756–799) ───────────────────

export const CONTRIBUTE_PILLARS_SECTION = {
  eyebrow: 'Where It Goes',
  titleLines: ['Three Pillars.', 'Every Contribution Feeds One.'] as const,
  desc: 'Your contribution is routed to the pillar where it creates the most leverage.',
} as const

export interface ContributePillar {
  readonly id: 'eco' | 'solutions' | 'ventures'
  readonly name: string
  readonly title: string
  readonly body: string
  readonly tags: readonly string[]
}

export const CONTRIBUTE_PILLARS: readonly ContributePillar[] = [
  {
    id: 'eco',
    name: 'SAGIE ECO',
    title: 'Community Foundation',
    body:
      'NPO infrastructure, events, chapter development, youth programs, and cross-border access initiatives.',
    tags: ['Events', 'Chapters', 'Youth', 'Mentorship'],
  },
  {
    id: 'solutions',
    name: 'SAGIE Solutions',
    title: 'ServiceHub',
    body:
      'Fractional executive marketplace. Expertise contributes as a provider or client. Capital connects to engagements.',
    tags: ['Skills', 'Expertise', 'Fractional'],
  },
  {
    id: 'ventures',
    name: 'SAGIE Ventures',
    title: 'Equity Portfolio',
    body:
      'Deal flow, co-investment, and network introductions that move capital to underrepresented founders.',
    tags: ['Capital', 'Deals', 'Intros'],
  },
] as const

export const CONTRIBUTE_PILLAR_HEX: Record<ContributePillar['id'], string> = {
  eco: '#7A9E7E',
  solutions: '#6B9EC0',
  ventures: '#8A8A8A',
}

// ─── CTA BANNER (mockup lines 802–811) ────────────────────────────────

export const CONTRIBUTE_CTA = {
  headline: 'Ready to Plug In?',
  body:
    'No minimum contribution. No gatekeeping. Just show up and tell us how you want to help.',
  ctaPrimary: { label: 'Start Contributing', href: '#form' },
  ctaGhost: { label: 'Learn About Membership', href: '/apply' },
} as const

// ─── FORM COPY (contribution-form.html lines 451–544) ─────────────────

export const CONTRIBUTE_FORM_COPY = {
  eyebrow: 'SAGIE ECO — Open Membership',
  titleLines: {
    lead: 'Shape a Great',
    emphasis: 'Impact Everywhere',
  },
  sub: {
    line1: "This isn't an application.",
    line2: "It's an introduction — tell us who you are and how you want to show up.",
  },

  name: {
    label: 'Name',
    placeholder: 'Your full name',
    autocomplete: 'name',
    error: 'Name is required.',
  },

  email: {
    label: 'Email',
    placeholder: 'you@example.com',
    autocomplete: 'email',
    error: 'Enter a valid email.',
  },

  contribute: {
    label: 'How you want to contribute',
    error: 'Pick at least one area.',
    chips: [
      { value: 'mentorship', label: 'Mentorship' },
      { value: 'collaboration', label: 'Collaboration' },
      { value: 'events', label: 'Events' },
      { value: 'fractional', label: 'Fractional Work' },
      { value: 'investment', label: 'Investment' },
      { value: 'resources', label: 'Resources & Tools' },
      { value: 'research', label: 'Research' },
      { value: 'other', label: 'Other' },
    ],
  },

  more: {
    label: 'Tell us more',
    labelNote: '— optional',
    placeholder:
      'What are you working on? What kind of people do you want to meet? What problem are you trying to solve?',
  },

  availability: {
    label: 'Availability',
    placeholder: 'How active can you be right now?',
    error: 'Please select your availability.',
    options: [
      { value: 'active', label: "Active — I'm all in" },
      { value: 'growing', label: 'Growing — learning and exploring' },
      { value: 'occasional', label: 'Occasional — show up when I can' },
      { value: 'lurking', label: 'Just looking for now' },
    ],
  },

  consent: {
    label: 'Privacy',
    text: "I'm okay with SAGIE keeping my information to connect me with the right people. No spam. No selling your data. That's a promise.",
    policyLink: 'Read our privacy policy.',
    error: "You'll need to agree to continue.",
  },

  submit: 'Join the Ecosystem →',

  success: {
    icon: '◎',
    title: "You're in the circuit.",
    message:
      "We'll be in touch soon. In the meantime — keep building. That's what we're all here to do.",
  },
} as const

// Human-readable labels used when serializing the form submission to Notion.
export const CONTRIBUTION_TYPE_LABELS: Record<string, string> = {
  mentorship: 'Mentorship',
  collaboration: 'Collaboration',
  events: 'Events',
  fractional: 'Fractional Work',
  investment: 'Investment',
  resources: 'Resources & Tools',
  research: 'Research',
  other: 'Other',
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  active: "Active — I'm all in",
  growing: 'Growing — learning and exploring',
  occasional: 'Occasional — show up when I can',
  lurking: 'Just looking for now',
}
