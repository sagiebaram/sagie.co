import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Button } from '@/components/ui/Button'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'

export const metadata: Metadata = {
  title: 'SAGIE Ventures — Trust Creates Deal Flow',
  description:
    'SAGIE Ventures connects accredited investors with innovative founders. Ambassador-backed portfolio, community-informed diligence, ecosystem-native deal flow.',
  openGraph: {
    title: 'SAGIE Ventures — Trust Creates Deal Flow',
    description:
      'SAGIE Ventures connects accredited investors with innovative founders. Ambassador-backed portfolio, community-informed diligence, ecosystem-native deal flow.',
  },
}

const STEPS = [
  {
    num: '01',
    title: 'Connect',
    body: 'Founders and investors surface through the SAGIE ECO community — events, introductions, and organic relationships. Every connection starts with trust.',
  },
  {
    num: '02',
    title: 'Evaluate',
    body: 'Community-informed diligence. Our members include operators, investors, and domain experts who provide real signal — not just slide feedback. Investors see what\u2019s real. Founders get honest input.',
  },
  {
    num: '03',
    title: 'Grow',
    body: 'Portfolio companies get more than capital — they get the full ecosystem. Investors get more than returns — they get proximity to the builders shaping what\u2019s next.',
  },
] as const

const FOCUS_AREAS = [
  'Impact-driven technology and innovation',
  'Community-powered businesses and movements',
  'Cross-border startups bridging markets',
  'Founders with ecosystem DNA',
] as const

const AMBASSADOR_DO = [
  'Source and refer high-quality founders',
  'Participate in community diligence',
  'Mentor portfolio founders',
  'Represent SAGIE Ventures in their city',
] as const

const AMBASSADOR_WHO = [
  'Accredited investors in the ecosystem',
  'Experienced operators and executives',
  'Chapter leads and Shaper-tier members',
  'Domain experts with sector depth',
] as const

export default function VenturesPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      {/* ── 1. Hero ── */}
      <Section className="pt-28 md:pt-36">
        <PageHeroAnimation>
          <Eyebrow className="page-hero-eyebrow text-ventures">SAGIE Ventures</Eyebrow>
          <SplitTextReveal as="h1" className="font-display uppercase text-hero leading-[0.9] tracking-heading mb-8" lines={[
            { text: 'TRUST CREATES', className: 'text-foreground-dim' },
            { text: 'DEAL FLOW.', className: 'text-foreground-secondary' },
          ]} />
          <p className="page-hero-sub font-body italic text-foreground-muted font-light text-body-lg leading-[1.7] max-w-[480px] mb-0">
            SAGIE Ventures connects accredited investors with innovative founders building movements — not just companies. We back startups as ambassadors, facilitate the right introductions, and build a portfolio where conviction meets community.
          </p>
        </PageHeroAnimation>
      </Section>

      {/* ── 2. The Model ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-ventures">The Model</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-8" lines={[
            { text: 'NOT A FUND.', className: 'text-foreground-dim' },
            { text: 'A BRIDGE.', className: 'text-foreground-secondary' },
          ]} />
          <div className="max-w-[720px] space-y-6 mb-12">
            <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light">
              SAGIE Ventures exists at the intersection of the ecosystem and the capital markets. We don&apos;t sit between investors and founders — we bring them into the same room, with trust already established.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AnimatedSection delay={0.1}>
            <div className="h-full rounded-sm border border-ventures-dim bg-ventures-bg p-8">
              <h3 className="font-display uppercase text-ventures-bright text-subhead tracking-heading mb-4">
                For Investors
              </h3>
              <p className="font-body text-foreground-muted text-body leading-[1.7] font-light">
                Deal flow that comes from proximity, not cold outreach. Community-informed diligence from operators who&apos;ve built what you&apos;re evaluating. A portfolio curated through relationships, not pitch decks.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="h-full rounded-sm border border-ventures-dim bg-ventures-bg p-8">
              <h3 className="font-display uppercase text-ventures-bright text-subhead tracking-heading mb-4">
                For Founders
              </h3>
              <p className="font-body text-foreground-muted text-body leading-[1.7] font-light">
                Visibility to accredited investors who are already part of the ecosystem. An ambassador behind your company that opens doors, lends credibility, and provides the network to scale.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3}>
          <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light text-center max-w-[640px] mx-auto">
            Returns flow back into SAGIE ECO — funding the programs that make the ecosystem stronger.
          </p>
        </AnimatedSection>
      </Section>

      {/* ── 3. How It Works ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-ventures">How It Works</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-12" lines={[
            { text: 'FROM ECOSYSTEM', className: 'text-foreground-dim' },
            { text: 'TO OPPORTUNITY.', className: 'text-foreground-secondary' },
          ]} />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 0.1}>
              <div className="h-full py-6 border-t border-ventures-dim">
                <p className="font-display text-ventures text-caption tracking-heading mb-2">
                  {step.num}
                </p>
                <p className="font-display uppercase text-ventures-bright text-subhead leading-none mb-3">
                  {step.title}
                </p>
                <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
                  {step.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* ── 4. The Portfolio ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-ventures">The Portfolio</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-8" lines={[
            { text: 'WHAT WE BACK', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light max-w-[720px] mb-12">
            SAGIE Ventures is building its portfolio — innovative startups, impact-driven companies, and movements that align with the ecosystem&apos;s values. We&apos;re looking for:
          </p>
        </AnimatedSection>

        {/* Focus area cards — grid ready to evolve into portfolio entries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {FOCUS_AREAS.map((area, i) => (
            <AnimatedSection key={area} delay={i * 0.1}>
              <div className="rounded-sm border border-ventures-dim bg-ventures-bg px-8 py-6">
                <p className="font-display uppercase text-ventures-bright text-subhead tracking-heading">
                  {area}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <p className="font-body italic text-foreground-muted text-body leading-[1.7] font-light text-center max-w-[560px] mx-auto">
            This section will evolve into a live portfolio showcase as companies join.
          </p>
        </AnimatedSection>
      </Section>

      {/* ── 5. Ambassador Program ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-ventures">Ambassador Program</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-8" lines={[
            { text: 'VENTURE AMBASSADORS', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light max-w-[720px] mb-12">
            SAGIE Venture Ambassadors are experienced operators and investors within the ecosystem who help source, evaluate, and support portfolio companies. They&apos;re the bridge between community trust and capital deployment.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={0.1}>
            <div className="h-full rounded-sm border border-ventures-dim bg-ventures-bg p-8">
              <h3 className="font-display uppercase text-ventures-bright text-subhead tracking-heading mb-6">
                What Ambassadors Do
              </h3>
              <ul className="space-y-4">
                {AMBASSADOR_DO.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-ventures" />
                    <span className="font-body text-foreground-muted text-body leading-[1.7] font-light">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="h-full rounded-sm border border-ventures-dim bg-ventures-bg p-8">
              <h3 className="font-display uppercase text-ventures-bright text-subhead tracking-heading mb-6">
                Who Becomes an Ambassador
              </h3>
              <ul className="space-y-4">
                {AMBASSADOR_WHO.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-ventures" />
                    <span className="font-body text-foreground-muted text-body leading-[1.7] font-light">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* ── 6. CTA — Two Paths ── */}
      <Section>
        <AnimatedSection className="text-center mb-12">
          <SplitTextReveal as="h2" className="font-display uppercase text-hero-cta leading-[0.9] tracking-heading mb-8" lines={[
            { text: "LET'S BUILD", className: 'text-foreground-dim' },
            { text: 'TOGETHER.', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body italic text-foreground-muted font-light text-body-lg leading-[1.7] max-w-[520px] mx-auto">
            Whether you&apos;re investing or building — the first step is a conversation.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={0.1}>
            <div className="h-full rounded-sm border border-ventures-dim bg-ventures-bg p-8 flex flex-col">
              <h3 className="font-display uppercase text-ventures-bright text-tier tracking-heading mb-4">
                I&apos;m an Investor
              </h3>
              <p className="font-body text-foreground-muted text-body leading-[1.7] font-light mb-8 flex-1">
                Looking for deal flow, community diligence, or a portfolio to back.
              </p>
              <Button variant="outline" href="/apply/ventures/investor">
                Schedule a Call &rarr;
              </Button>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="h-full rounded-sm border border-ventures-dim bg-ventures-bg p-8 flex flex-col">
              <h3 className="font-display uppercase text-ventures-bright text-tier tracking-heading mb-4">
                I&apos;m a Founder
              </h3>
              <p className="font-body text-foreground-muted text-body leading-[1.7] font-light mb-8 flex-1">
                Building something innovative and looking for visibility, support, and access to capital.
              </p>
              <Button variant="outline" href="/apply/ventures/founder">
                Schedule a Call &rarr;
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      <Footer />
    </main>
  )
}
