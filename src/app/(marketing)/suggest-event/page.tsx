import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { SuggestEventForm } from '@/components/forms/SuggestEventForm'

export default function SuggestEventPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-[1] overflow-hidden">
        <GridBackground />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            Suggest an Event
          </p>
          <h1 className="font-display uppercase text-hero leading-[0.9] mb-8">
            <span className="block text-foreground-dim">GOT AN IDEA</span>
            <span className="block text-foreground-secondary">FOR AN EVENT?</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-12">
            Tell us what you have in mind. SAGIE events are curated — if it fits the ecosystem, we&apos;ll make it happen.
          </p>
          <SuggestEventForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
