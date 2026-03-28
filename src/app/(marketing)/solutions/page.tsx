import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Button } from '@/components/ui/Button'
import { SolutionsFilter } from '@/components/ui/SolutionsFilter'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SERVICE_CATEGORIES } from '@/constants/solutions'
import { getSolutionProviders, type SolutionProvider } from '@/lib/solutions'

export const revalidate = 3600

const STEPS = [
  { num: '01', title: 'Join as a Builder', desc: 'Membership is the entry point. Builders are vetted before offering services.' },
  { num: '02', title: 'Offer your expertise', desc: 'Services are listed and matched with members or external clients who need them.' },
  { num: '03', title: 'Revenue funds the mission', desc: 'Every engagement through SAGIE Solutions supports the ecosystem. Builder members access services at a discounted rate.' },
]

export default async function SolutionsPage() {
  let providers: SolutionProvider[] = []

  try {
    providers = await getSolutionProviders()
  } catch (e) {
    console.error('Failed to fetch solution providers:', e)
  }

  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-1 overflow-hidden">
        <GridBackground />
        <PageHeroAnimation>
          <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
            <p className="page-hero-eyebrow font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
              SAGIE Solutions
            </p>
            <h1 className="font-display uppercase text-hero leading-[0.9] mb-8">
              <span className="page-hero-line block text-foreground-dim">THE EXPERTISE</span>
              <span className="page-hero-line block text-foreground-secondary">IS IN THE ROOM.</span>
            </h1>
            <p className="page-hero-sub font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px]">
              Operated by vetted community members who offer expertise to one another and to external clients. Revenue flows back to fund the mission.
            </p>
          </div>
        </PageHeroAnimation>
      </section>

      {/* How it works */}
      <Section>
        <Eyebrow>How it works</Eyebrow>
        <ScrollReveal selector=".step" stagger={0.12} y={20} duration={0.55}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="step py-6 border-t border-border-subtle">
                <p className="font-display text-foreground-dim text-caption tracking-heading mb-2">
                  {step.num}
                </p>
                <p className="font-display uppercase text-foreground-secondary text-subhead leading-none mb-3">
                  {step.title}
                </p>
                <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* Service categories */}
      <Section>
        <Eyebrow>Service categories</Eyebrow>
        <ScrollReveal selector=".cat-card" stagger={0.06} y={16} duration={0.45}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px">
            {SERVICE_CATEGORIES.map((cat) => (
              <div key={cat.name} className="cat-card border border-border-default p-8 hover:bg-background-card-featured transition-colors duration-200">
                <p className="font-display uppercase text-foreground-secondary text-subhead leading-none mb-3">
                  {cat.name}
                </p>
                <p className="font-body text-foreground-muted text-caption font-light leading-[1.75]">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* Gated bar */}
      <section className="relative z-1 border-t border-border-strong border-b border-b-border-strong">
        <ScrollReveal y={12} duration={0.4}>
          <div className="max-w-[880px] mx-auto px-6 md:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-[560px]">
              <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
                Specific providers, pricing and availability are visible to Builder members and above.
              </p>
              <p className="font-body italic text-foreground-dim text-body font-light leading-[1.75] mt-2">
                Builder members access all services at a discounted rate. Every engagement funds the ecosystem.
              </p>
            </div>
            <a
              href="/apply/solutions"
              className="font-body text-foreground-secondary hover:text-silver hover:-translate-y-px transition-all duration-150 text-button tracking-button uppercase whitespace-nowrap"
            >
              Apply to Join →
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* Community Providers */}
      <Section>
        <Eyebrow>Community Providers</Eyebrow>
        <SolutionsFilter providers={providers} />
      </Section>

      {/* CTA */}
      <section className="relative z-1 overflow-hidden">
        <GridBackground />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 py-20 md:py-32">
          <h2 className="font-display uppercase text-hero leading-[0.9] mb-8">
            <span className="block text-foreground-dim">READY TO OFFER</span>
            <span className="block text-foreground-secondary">YOUR EXPERTISE?</span>
          </h2>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-10">
            Become a Builder and bring your skills to the ecosystem.
          </p>
          <Button variant="primary" href="/apply/solutions">Apply to Join →</Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
