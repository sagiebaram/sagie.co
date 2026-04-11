import type { Metadata } from 'next'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { ContributeV2Hero } from '@/components/sections/ContributeV2Hero'
import { ContributeV2Why } from '@/components/sections/ContributeV2Why'
import { ContributeV2Categories } from '@/components/sections/ContributeV2Categories'
import { ContributeV2HowItWorks } from '@/components/sections/ContributeV2HowItWorks'
import { ContributeV2ClosingCTA } from '@/components/sections/ContributeV2ClosingCTA'
import { CONTRIBUTE_V2_METADATA } from '@/constants/contribute-v2'

/**
 * /contribute-v2 — Sprint 04-11 Track 2 revision, A/B comparison page.
 *
 * This route is intentionally unlinked (no nav entry, not in the sitemap)
 * so Sagie can review it side-by-side with /contribute (v1) and pick a
 * winner. No form, no API calls, no Notion writes — the closing CTA
 * routes to /apply because the dedicated contribute form is deferred to
 * a post-Track 3 forms consolidation sprint.
 *
 * Visual differentiation from v1:
 *   - Hero is an asymmetric 2-column split (left: eyebrow+headline,
 *     right: subtitle + vertical decorative label) vs v1's centered stack.
 *   - Categories are a tall vertical numbered list with large gold numbers
 *     vs v1's 3×2 card grid.
 *   - How It Works is a 3-step horizontal timeline with a gold rail vs
 *     v1's 4-card grid with connector dots.
 *   - Closing CTA is a full-bleed dark band with a single oversized button
 *     vs v1's inline gold banner with two CTAs.
 */
export const metadata: Metadata = {
  title: CONTRIBUTE_V2_METADATA.title,
  description: CONTRIBUTE_V2_METADATA.description,
  // Keep v2 out of search engines while it's an unlinked draft.
  robots: { index: false, follow: false },
}

export default function ContributeV2Page() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <ContributeV2Hero />
      <ContributeV2Why />
      <ContributeV2Categories />
      <ContributeV2HowItWorks />
      <ContributeV2ClosingCTA />

      <Footer />
    </main>
  )
}
