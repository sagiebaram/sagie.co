import type { Metadata } from 'next'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { ContributeHero } from '@/components/sections/ContributeHero'
import { ContributeGrid } from '@/components/sections/ContributeGrid'
import { ContributeHowItWorks } from '@/components/sections/ContributeHowItWorks'
import { ContributePillars } from '@/components/sections/ContributePillars'
import { ContributeCTA } from '@/components/sections/ContributeCTA'
import { ContributeForm } from '@/components/forms/ContributeForm'
import { Ticker } from '@/components/ui/Ticker'
import {
  CONTRIBUTE_METADATA,
  CONTRIBUTE_TICKER_ITEMS,
  CONTRIBUTE_FORM_COPY,
} from '@/constants/contribute'

export const metadata: Metadata = {
  title: CONTRIBUTE_METADATA.title,
  description: CONTRIBUTE_METADATA.description,
}

/**
 * /contribute — Sprint 04-11 Track 2.
 *
 * Section order (matches mockups/contribute-page.html):
 *   1. Hero (BUILD WITH US)
 *   2. Ticker band
 *   3. Ways to Contribute — 6 cards
 *   4. How It Works — 4 steps
 *   5. Where It Goes — 3 pillars
 *   6. CTA banner
 *   7. ContributeForm (anchored at #form)
 */
export default function ContributePage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <ContributeHero />

      <Ticker items={CONTRIBUTE_TICKER_ITEMS} />

      <ContributeGrid />

      <hr className="relative max-w-[1200px] mx-auto border-t border-border-subtle mx-6 md:mx-8" />

      <ContributeHowItWorks />

      <hr className="relative max-w-[1200px] mx-auto border-t border-border-subtle mx-6 md:mx-8" />

      <ContributePillars />

      <ContributeCTA />

      {/* Embedded form — scroll target for the CTA banner and the 6 cards */}
      <section
        id="form"
        className="relative py-20 px-6 md:px-8"
        aria-label={CONTRIBUTE_FORM_COPY.titleLines.lead}
      >
        <div className="relative max-w-[600px] mx-auto">
          <ContributeForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
