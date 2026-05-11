/**
 * Copy for /contribute-v2 — Sagie's 04-11 5-category paste (verbatim).
 *
 * This is a separate, unlinked comparison page built alongside /contribute
 * (v1) for A/B review. Copy lives in its own constants file so the two pages
 * do not share strings and the copy sources stay clearly scoped.
 *
 * Do NOT paraphrase. Do NOT reformat punctuation. Em-dashes and oxford commas
 * are intentional throughout.
 */

// ─── META ─────────────────────────────────────────────────────────────

export const CONTRIBUTE_V2_METADATA = {
  title: 'Contribute (v2 draft)',
  description:
    'Membership is the starting point. Contribution is what moves the ecosystem — and what moves you through it.',
} as const

// ─── HERO ─────────────────────────────────────────────────────────────

export const CONTRIBUTE_V2_HERO = {
  eyebrow: 'Shape a Great Impact Everywhere',
  headline: 'The Ecosystem Runs on What You Bring.',
  subtitle:
    'Membership is the starting point. Contribution is what moves the ecosystem — and what moves you through it.',
} as const

// ─── WHY CONTRIBUTE — manifesto section ───────────────────────────────

export const CONTRIBUTE_V2_WHY = {
  eyebrow: 'Why Contribute',
  title: 'Contribution Is the Core Model',
  paragraphs: [
    "SAGIE doesn't run on subscriptions. It runs on contribution.",
    'Every member has something to bring — expertise, connections, opportunities, resources, or feedback. When those flow between the right people, the whole ecosystem gets stronger. That\u2019s the model. That\u2019s the entire thing.',
    "There\u2019s no minimum. There\u2019s no gatekeeping. There\u2019s no \u201Cright\u201D form of contribution. The only thing we ask is that you show up and offer something real \u2014 and we\u2019ll handle the rest.",
  ],
} as const

// ─── FIVE CONTRIBUTION CATEGORIES ─────────────────────────────────────

export const CONTRIBUTE_V2_CATEGORIES_SECTION = {
  eyebrow: 'Five Ways to Create Value',
  title: 'Five Contribution Types. Infinite Impact.',
  desc: "Every contribution flows into the ecosystem and routes where it's needed most.",
} as const

export interface ContributeV2Category {
  readonly num: string
  readonly id: 'expertise' | 'connections' | 'opportunities' | 'resources' | 'feedback'
  readonly name: string
  readonly body: string
}

export const CONTRIBUTE_V2_CATEGORIES: readonly ContributeV2Category[] = [
  {
    num: '01',
    id: 'expertise',
    name: 'Expertise',
    body:
      "The skills you've spent years building — product, sales, operations, design, fundraising, legal, engineering, whatever your craft — are the fastest way to move the ecosystem forward. Mentor a founder. Review a pitch. Run an AMA. Sit on a panel. When you teach what you know, you compound every hour you've already spent learning it.",
  },
  {
    num: '02',
    id: 'connections',
    name: 'Connections',
    body:
      'Your network is a superpower. A single warm introduction can unlock a hire, a customer, a check, or a co-founder. If you know someone who should know someone else in SAGIE, make the bridge. The highest-leverage contribution almost always costs you one email — and creates value that lasts for years.',
  },
  {
    num: '03',
    id: 'opportunities',
    name: 'Opportunities',
    body:
      'Job openings. Speaking slots. Deal flow. Partnership leads. Grant programs. Pilot budgets. If you see a door opening somewhere and you know a SAGIE member who should walk through it, pass it along. Opportunities shared inside the ecosystem compound faster than opportunities hoarded outside of it.',
  },
  {
    num: '04',
    id: 'resources',
    name: 'Resources',
    body:
      'Templates, playbooks, legal docs, design files, research reports, tools, discount codes, spare server credits, extra event tickets — the stuff that sits in your Google Drive collecting dust. Contribute it to the SAGIE knowledge base and it becomes leverage for every member who needs it next.',
  },
  {
    num: '05',
    id: 'feedback',
    name: 'Feedback',
    body:
      "The hardest and most valuable contribution. Tell us what's working and what isn't. Push back when we're wrong. Point out what we're missing. Feedback is how SAGIE stays honest — and how the people inside it stay sharp. This one costs nothing and changes everything.",
  },
] as const

// ─── HOW IT WORKS — 3 steps ───────────────────────────────────────────

export const CONTRIBUTE_V2_HOW_SECTION = {
  eyebrow: 'How It Works',
  title: 'The Process Is Simple. The Impact Compounds.',
} as const

export interface ContributeV2Step {
  readonly num: string
  readonly title: string
  readonly body: string
}

export const CONTRIBUTE_V2_STEPS: readonly ContributeV2Step[] = [
  {
    num: '01',
    title: 'Choose your contribution type',
    body:
      'Pick whichever of the five fits where you are right now. You can always come back and offer more.',
  },
  {
    num: '02',
    title: 'Submit through the form',
    body:
      'A short intake — just enough for us to route you correctly. No lengthy forms. No gatekeeping.',
  },
  {
    num: '03',
    title: 'Watch it circulate',
    body:
      "Your contribution enters the ecosystem and finds the member who needs it most. You'll see the results in the network — and in yourself.",
  },
] as const

// ─── CLOSING CTA ──────────────────────────────────────────────────────

export const CONTRIBUTE_V2_CLOSING = {
  eyebrow: 'Movement Is Earned',
  title: 'Movement Between Tiers Is Earned. Contribution Is How.',
  body:
    'Show up. Offer something real. Keep showing up. The ecosystem notices — and so do the people inside it. That\u2019s how you move through SAGIE. That\u2019s how SAGIE moves through the world.',
  // CTA links to /apply because the contribution form itself is deferred.
  // When the dedicated form ships in a future sprint this href will swap
  // to /contribute-v2#form (or similar).
  cta: { label: 'Contribute to the Ecosystem →', href: '/apply' },
} as const
