import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apply — Join SAGIE ECO',
}

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { MembershipForm } from '@/components/forms/MembershipForm'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'

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
          <MembershipForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
