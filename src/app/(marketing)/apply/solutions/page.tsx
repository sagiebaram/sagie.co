import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { SolutionsForm } from '@/components/forms/SolutionsForm'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'

export const metadata: Metadata = {
  title: 'Apply — Solutions Provider',
}

export default function ApplySolutionsPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-[1] overflow-hidden">
        <GridBackground parallax />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            SAGIE Solutions
          </p>
          <SplitTextReveal as="h1" className="font-display uppercase text-hero leading-[0.9] mb-8" lines={[
            { text: 'OFFER YOUR', className: 'text-foreground-dim' },
            { text: 'EXPERTISE.', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-12">
            You need to be a Builder member first. Your expertise will be vetted before being offered to the ecosystem.
          </p>
          <SolutionsForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
