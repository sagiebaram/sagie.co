import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { ChapterForm } from '@/components/forms/ChapterForm'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'

export const metadata: Metadata = {
  title: 'Apply — Chapter Lead',
}

export default function ApplyChapterPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-[1] overflow-hidden">
        <GridBackground parallax />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            Lead a Chapter
          </p>
          <SplitTextReveal as="h1" className="font-display uppercase text-hero leading-display mb-8" lines={[
            { text: 'BRING SAGIE', className: 'text-foreground-muted' },
            { text: 'TO YOUR CITY.', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body italic text-foreground-muted text-body font-light leading-body max-w-[380px] mb-12">
            Tell us about your city. We&apos;ll take it from there.
          </p>
          <ChapterForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
