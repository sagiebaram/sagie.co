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
  title: 'SAGIE ECO — The Ecosystem',
  description:
    'SAGIE ECO is the community foundation — where genuine human relationships create real business opportunities across borders.',
  openGraph: {
    title: 'SAGIE ECO — The Ecosystem',
    description:
      'SAGIE ECO is the community foundation — where genuine human relationships create real business opportunities across borders.',
  },
}

const PARADOXES = [
  {
    title: 'The Junior Paradox',
    body: 'You need experience to get a job and a job to get experience. A closed loop that excludes the people with the most potential.',
  },
  {
    title: 'The Academy Paradox',
    body: "By the time you graduate, the degree is already obsolete. The system wasn\u2019t built for the pace of the world\u2019s advancements.",
  },
  {
    title: 'The Geography Paradox',
    body: "Where you were born determines what opportunities reach you. Talent is global. Access isn\u2019t.",
  },
] as const

const VISION_STEPS = [
  'Create cross-border connections that turn into real partnerships and businesses',
  'Create tech literacy programs from Pre-K to senior year — so graduation means practical skills, not just a credential',
  'Create a bridge of opportunities for talents across borders, and promote remote work',
  'Create programs to support people displaced by AI and layoffs — and equip them to lead, not just recover',
  'Create research programs where deal flows are broken, understand the roots of it, and build infrastructure as a standard',
] as const

const TIERS = [
  {
    name: 'Explorer',
    tag: 'Where it starts.',
    body: 'Open to anyone accepted. Access community events, resource directory, global member network. Your introduction to what SAGIE can be.',
  },
  {
    name: 'Builder',
    tag: 'Consistent value creators.',
    body: 'Recognized for active contribution — hosting events, sharing resources, making introductions. Builders unlock the Solutions marketplace and deeper network access.',
  },
  {
    name: 'Shaper',
    tag: 'The inner circle.',
    body: 'Invite-only. The architects of the ecosystem — chapter leads, strategic advisors, the people other members look to for direction.',
  },
] as const

const CHAPTERS = [
  { city: 'Miami', status: 'Active', detail: 'Founded 2025' },
  { city: 'Tel Aviv', status: 'Coming Soon', detail: null },
  { city: 'Texas', status: 'Coming Soon', detail: null },
  { city: 'Singapore', status: 'Coming Soon', detail: null },
  { city: 'New York', status: 'Coming Soon', detail: null },
  { city: 'Dubai', status: 'Coming Soon', detail: null },
] as const

const MISSION_PROGRAMS = [
  'Tech education programs',
  'Veteran support programs',
  'Research programs',
  'Cross-cultural exchange and mentorship programs',
] as const

export default function EcoPage() {
  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />

      {/* ── 1. Hero ── */}
      <Section className="pt-28 md:pt-36">
        <PageHeroAnimation>
          <Eyebrow className="page-hero-eyebrow text-eco">SAGIE ECO</Eyebrow>
          <h1 className="font-display uppercase text-hero leading-[0.9] tracking-heading mb-8">
            <span className="page-hero-line block text-foreground-dim">THE ECOSYSTEM</span>
            <span className="page-hero-line block text-foreground-secondary">IS THE PRODUCT.</span>
          </h1>
          <p className="page-hero-sub font-body italic text-foreground-muted font-light text-body-lg leading-[1.7] max-w-[480px] mb-0">
            SAGIE ECO is the community foundation — where genuine human relationships create real business opportunities across borders.
          </p>
        </PageHeroAnimation>
      </Section>

      {/* ── 2. The Belief ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-eco">The Belief</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-8" lines={[
            { text: 'GIVE FIRST.', className: 'text-foreground-dim' },
            { text: 'EVERYTHING FOLLOWS.', className: 'text-foreground-secondary' },
          ]} />
          <div className="max-w-[720px] space-y-6">
            <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light">
              SAGIE ECO is not a networking group. It&apos;s a living ecosystem built on a tested belief — that helping others creates opportunities you wouldn&apos;t find by chasing them. Trust compounds in ways that calculation never can.
            </p>
            <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light">
              This isn&apos;t idealism. This is infrastructure for how the best deals, partnerships, and careers actually happen.
            </p>
          </div>
        </AnimatedSection>
      </Section>

      {/* ── 3. What We Will Disrupt ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-eco">What We Will Disrupt</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-12" lines={[
            { text: 'THREE PARADOXES.', className: 'text-foreground-dim' },
            { text: 'ONE ECOSYSTEM.', className: 'text-foreground-secondary' },
          ]} />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PARADOXES.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <div className="h-full rounded-sm border border-eco-dim bg-eco-bg p-8">
                <h3 className="font-display uppercase text-eco-bright text-subhead tracking-heading mb-4">
                  {p.title}
                </h3>
                <p className="font-body text-foreground-muted text-body leading-[1.7] font-light">
                  {p.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light text-center max-w-[640px] mx-auto">
            SAGIE ECO is built on the opposite — trust, transparency, and collaboration as the actual operating model.
          </p>
        </AnimatedSection>
      </Section>

      {/* ── 4. The Vision ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-eco">The Vision</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-8" lines={[
            { text: "WHAT WE'RE BUILDING", className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light max-w-[720px] mb-6">
            Break the paradoxes by creating parallel systems. Using open source principles as a philosophy and a mental model to create transparency, trust, accountability, and collaboration will bridge cultures so people understand each other well enough to build together as a collective.
          </p>
          <p className="font-body text-foreground-muted text-body leading-[1.7] font-light max-w-[640px] mb-16 pl-4 border-l-2 border-eco-dim">
            The current layer of the ecosystem is tech — but eventually we will open layers for any kind of entrepreneurs and labor. SAGIE will start the movement, and provide a role model for any person out there to take the lead and create something of their own to make a positive impact.
          </p>
        </AnimatedSection>

        {/* Vertical timeline */}
        <div className="relative">
          {VISION_STEPS.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="flex gap-5 md:gap-8 mb-10 last:mb-0">
                {/* Step marker + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="flex items-center justify-center w-[36px] h-[36px] md:w-[48px] md:h-[48px] rounded-full border border-eco bg-eco-bg">
                    <span className="font-display text-eco text-caption md:text-subhead">
                      {i + 1}
                    </span>
                  </div>
                  {i < VISION_STEPS.length - 1 && (
                    <div aria-hidden="true" className="w-px flex-1 bg-eco-dim mt-2" />
                  )}
                </div>
                {/* Step text */}
                <p className="font-body text-foreground-secondary text-body-lg leading-[1.7] font-light pt-1.5 md:pt-2.5">
                  {step}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* ── 5. How You Grow (Tiers) ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-eco">How You Grow</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-4" lines={[
            { text: 'WHAT YOU GIVE', className: 'text-foreground-dim' },
            { text: 'IS WHAT YOU RECEIVE.', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body text-foreground-muted text-body-lg leading-[1.7] font-light max-w-[560px] mb-12">
            The people who create the most value earn the most access. Growth is recognized, not bought.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.1}>
              <div className="h-full rounded-sm border border-eco-dim bg-eco-bg p-8">
                <h3 className="font-display uppercase text-eco-bright text-tier tracking-heading mb-1">
                  {tier.name}
                </h3>
                <p className="font-body text-eco text-caption tracking-label uppercase mb-6">
                  {tier.tag}
                </p>
                <p className="font-body text-foreground-muted text-body leading-[1.7] font-light">
                  {tier.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* ── 6. City By City (Chapters) ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-eco">City By City</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-8" lines={[
            { text: 'ROOTED LOCALLY.', className: 'text-foreground-dim' },
            { text: 'CONNECTED GLOBALLY.', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light max-w-[720px] mb-12">
            SAGIE ECO operates through chapters — each one a micro-community with its own events, energy, and leadership. Chapter leads are trusted partners who carry the SAGIE ethos into their city and curate membership personally.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {CHAPTERS.map((ch, i) => (
            <AnimatedSection key={ch.city} delay={i * 0.08}>
              <div className="rounded-sm border border-border-default bg-background-card p-5">
                <p className="font-display uppercase text-foreground-secondary text-subhead tracking-heading mb-2">
                  {ch.city}
                </p>
                <span
                  className="inline-block font-body uppercase text-label tracking-button px-2 py-0.5"
                  style={{
                    border: `1px solid ${ch.status === 'Active' ? 'var(--color-eco)' : 'var(--color-foreground-dim)'}`,
                    color: ch.status === 'Active' ? 'var(--color-eco)' : 'var(--color-foreground-dim)',
                  }}
                >
                  {ch.status}
                </span>
                {ch.detail && (
                  <p className="font-body text-foreground-muted text-caption mt-2">{ch.detail}</p>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <p className="font-body text-foreground-muted text-body mb-4">
            Want to lead a chapter in your city?
          </p>
          <Button variant="outline" href="/apply/chapter">
            Start a Chapter
          </Button>
        </AnimatedSection>
      </Section>

      {/* ── 7. Where The Mission Lives ── */}
      <Section>
        <AnimatedSection>
          <Eyebrow className="text-eco">Impact</Eyebrow>
          <SplitTextReveal as="h2" className="font-display uppercase text-chapter leading-[0.95] tracking-heading mb-8" lines={[
            { text: 'WHERE THE MISSION LIVES', className: 'text-foreground-secondary' },
          ]} />
          <p className="font-body text-foreground-secondary text-body-lg leading-[1.8] font-light max-w-[720px] mb-12">
            Once established as an NPO, revenue from SAGIE Solutions flows back here. Every engagement funds what matters.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MISSION_PROGRAMS.map((program, i) => (
            <AnimatedSection key={program} delay={i * 0.1}>
              <div className="rounded-sm border border-eco-dim bg-eco-bg px-8 py-6">
                <p className="font-display uppercase text-eco-bright text-subhead tracking-heading">
                  {program}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* ── 8. CTA ── */}
      <Section>
        <AnimatedSection className="text-center">
          <h2 className="font-display uppercase text-hero-cta leading-[0.9] tracking-heading mb-8">
            <span className="block text-foreground-dim">THE GARDEN</span>
            <span className="block text-foreground-secondary">IS GROWING.</span>
          </h2>
          <p className="font-body italic text-foreground-muted font-light text-body-lg leading-[1.7] max-w-[520px] mx-auto mb-10">
            People are good at their core. Everyone has a dream and a purpose. We&apos;re building the conditions where every dream could become a reality.
          </p>
          <Button href="/apply">Apply to Join &rarr;</Button>
        </AnimatedSection>
      </Section>

      <Footer />
    </main>
  )
}
