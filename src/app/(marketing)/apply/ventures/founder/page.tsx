import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { VenturesForm } from '@/components/forms/VenturesForm'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'

export const metadata: Metadata = {
  title: 'Apply — Ventures Founder',
}

export default function ApplyVenturesFounderPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-1 overflow-hidden">
        <GridBackground parallax />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            SAGIE Ventures — Founders
          </p>
          <SplitTextReveal as="h1" className="font-display uppercase text-hero leading-[0.9] mb-8" lines={[
            { text: 'SHOW US WHAT', className: 'text-foreground-dim' },
            { text: "YOU'RE BUILDING.", className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-12">
            Positive impact or innovation? Reach out and see if we&apos;re a match.
          </p>
          <VenturesForm type="founder" />
        </div>
      </section>

      <Footer />
    </main>
  )
}
