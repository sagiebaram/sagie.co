import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apply',
}

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'

// NOTE: The legacy MembershipForm has been removed. The 6-step MembershipWizard
// is being built in Track 3 (see .planning/ADR-MEMBERSHIP-WIZARD.md). Until it
// lands, this page renders a simple placeholder so the /apply route still
// resolves and the rest of the site builds/typechecks cleanly.

export default function ApplyPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-1 overflow-hidden">
        <GridBackground parallax />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            Join SAGIE ECO
          </p>
          <SplitTextReveal as="h1" className="font-display uppercase text-hero leading-[0.9] mb-8" lines={[
            { text: 'START AS AN', className: 'text-foreground-dim' },
            { text: 'EXPLORER.', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-12">
            Every application is reviewed. The community is curated by design.
          </p>
          <div
            data-testid="membership-wizard-placeholder"
            className="border border-border-default bg-background-card px-8 py-12 text-foreground-muted font-body text-body leading-[1.7]"
          >
            <p className="uppercase text-[11px] tracking-[0.14em] text-foreground-dim mb-3">
              Coming soon
            </p>
            <p>
              The new membership application is being rebuilt as a 6-step wizard.
              Check back shortly — the form will live here.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
