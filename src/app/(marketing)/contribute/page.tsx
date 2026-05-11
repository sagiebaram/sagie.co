import type { Metadata } from 'next'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { ContributeHero } from '@/components/sections/ContributeHero'
import { ContributeGrid } from '@/components/sections/ContributeGrid'
import { ContributeHowItWorks } from '@/components/sections/ContributeHowItWorks'
import { Ticker } from '@/components/ui/Ticker'
import { CONTRIBUTE_METADATA, CONTRIBUTE_TICKER_ITEMS } from '@/constants/contribute'

export const metadata: Metadata = {
  title: CONTRIBUTE_METADATA.title,
  description: CONTRIBUTE_METADATA.description,
}

/**
 * /contribute — Sprint 04-11 Track 2 (revised post-v1 review).
 *
 * Scope this revision:
 *   - Hero alignment matches the pillar pages (/solutions, /eco, /ventures)
 *   - Ticker uses a true CSS-only infinite loop with snappier timing
 *   - Ways section H2 + card bodies revised to Sagie's 04-11 copy
 *   - How It Works render bug fixed (steps had inherited .step opacity: 0)
 *   - Pillars ("Where It Goes") and CTA banner deleted
 *   - Form / API / Notion DB deferred to the forms consolidation sprint
 *     post-Track 3 (see SPRINT-04-11-SESSIONS.md Track 2 revision)
 *
 * Section order:
 *   1. Hero (BUILD WITH US)
 *   2. Ticker band
 *   3. Ways to Contribute — 6 cards
 *   4. How It Works — 4 steps
 */
export default function ContributePage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <ContributeHero />

      <Ticker items={CONTRIBUTE_TICKER_ITEMS} />

      <ContributeGrid />

      <ContributeHowItWorks />

      <Footer />
    </main>
  )
}
