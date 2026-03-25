import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Button } from '@/components/ui/Button'
import { SolutionsFilter } from '@/components/ui/SolutionsFilter'
import { SERVICE_CATEGORIES } from '@/constants/solutions'

const STEPS = [
  { num: '01', title: 'Join as a Builder', desc: 'Membership is the entry point. Builders are vetted before offering services.' },
  { num: '02', title: 'Offer your expertise', desc: 'Services are listed and matched with members or external clients who need them.' },
  { num: '03', title: 'Revenue funds the mission', desc: 'Every engagement through SAGIE Solutions supports the ecosystem. Builder members access services at a discounted rate.' },
]

export default function SolutionsPage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative z-[1] overflow-hidden min-h-[70vh]">
        <GridBackground />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            SAGIE Solutions
          </p>
          <h1 className="font-display uppercase text-hero leading-[0.9] mb-8">
            <span className="block text-foreground-secondary">THE EXPERTISE</span>
            <span className="block text-foreground">IS IN THE ROOM.</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[520px]">
            Operated by vetted community members who offer expertise to one another and to external clients. Revenue flows back to fund the mission.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <Section>
        <Eyebrow>How it works</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="py-6 border-t border-border-subtle">
              <p className="font-display text-foreground-dim text-[14px] tracking-heading mb-2">
                {step.num}
              </p>
              <p className="font-display uppercase text-silver text-[18px] leading-none mb-3">
                {step.title}
              </p>
              <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Service categories ── */}
      <Section>
        <Eyebrow>Service categories</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map((cat) => (
            <div key={cat.name} className="border border-border-subtle flex flex-col">
              <div className="p-5 flex-1">
                <p className="font-display text-silver text-[16px] leading-none mb-2">
                  {cat.name}
                </p>
                <p className="font-body text-foreground-muted text-[10px] font-light leading-[1.6]">
                  {cat.description}
                </p>
              </div>
              <div className="border-t border-border-subtle px-5 py-3">
                <p className="font-body text-foreground-ghost text-[10px]">
                  Details available to members
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Gated bar ── */}
      <section className="relative z-[1] border-t border-border-strong border-b border-b-border-strong">
        <div className="max-w-[880px] mx-auto px-6 md:px-8 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-[560px]">
            <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
              Specific providers, pricing and availability are visible to Builder members and above.
            </p>
            <p className="font-body italic text-foreground-ghost text-body font-light leading-[1.75] mt-1">
              Builder members access all services at a discounted rate. Every engagement funds the ecosystem.
            </p>
          </div>
          <a
            href="/apply/solutions"
            className="font-body text-silver hover:text-foreground hover:-translate-y-px transition-all duration-150 text-button tracking-button uppercase whitespace-nowrap"
          >
            Apply to Join →
          </a>
        </div>
      </section>

      {/* ── Community Providers ── */}
      <Section>
        <Eyebrow>Community Providers</Eyebrow>
        <SolutionsFilter />
      </Section>

      {/* ── CTA ── */}
      <Section>
        <div className="text-center py-8 md:py-16">
          <h2 className="font-display uppercase text-foreground text-pillar leading-[0.95] mb-4">
            Ready to offer<br />your expertise?
          </h2>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] mb-8 max-w-[400px] mx-auto">
            Become a Builder and bring your skills to the ecosystem.
          </p>
          <Button variant="primary" href="/apply/solutions">Apply to Join →</Button>
        </div>
      </Section>

      <Footer />
    </main>
  )
}
