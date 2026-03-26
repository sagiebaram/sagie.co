import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { TypeformEmbed } from '@/components/ui/TypeformEmbed'
import { FORM_IDS } from '@/constants/forms'

export default function ApplySolutionsPage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-[1] overflow-hidden">
        <GridBackground />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            SAGIE Solutions
          </p>
          <h1 className="font-display uppercase text-hero leading-[0.9] mb-8">
            <span className="block text-foreground-dim">OFFER YOUR</span>
            <span className="block text-foreground-secondary">EXPERTISE.</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-12">
            You need to be a Builder member first. Your expertise will be vetted before being offered to the ecosystem.
          </p>
          <TypeformEmbed formId={FORM_IDS.solutions} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
