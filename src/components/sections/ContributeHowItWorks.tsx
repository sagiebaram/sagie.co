import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CONTRIBUTE_HOW_SECTION, CONTRIBUTE_STEPS } from '@/constants/contribute'

/**
 * "How It Works" section — 4 step cards, matching the `/solutions` pillar
 * page pattern (Eyebrow + sr-only H2 + ScrollReveal-wrapped step cards).
 *
 * Render bug fix (v1): the previous implementation put the `.step` class on
 * each step card *without* a `<ScrollReveal selector=".step">` wrapper. The
 * global stylesheet declares `.step { opacity: 0 }` as a scroll-reveal initial
 * state (src/app/globals.css:222), and without a reveal trigger the cards
 * stayed at opacity 0 forever. The H2 rendered, the section had height, but
 * every step body was invisible — which read as "the section doesn't render"
 * on visual inspection.
 *
 * Fix: wrap the step cards in a <ScrollReveal selector=".step"> exactly the
 * way Solutions/Events/Resources pages do, so the global initial state is
 * matched by the reveal animation and opacity transitions back to 1.
 */
export function ContributeHowItWorks() {
  const { eyebrow, title, desc } = CONTRIBUTE_HOW_SECTION

  return (
    <Section id="contribute-how">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display uppercase text-foreground-secondary text-pillar leading-none tracking-heading mb-4">
        {title}
      </h2>
      <p className="font-body text-foreground-muted text-body font-light leading-[1.75] max-w-[560px] mb-12">
        {desc}
      </p>

      <ScrollReveal selector=".step" stagger={0.12} y={20} duration={0.55}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px">
          {CONTRIBUTE_STEPS.map((step) => (
            <div
              key={step.num}
              className="step border border-border-default bg-background-card px-7 py-9"
            >
              <p
                className="font-display text-foreground-dim text-caption tracking-heading mb-2"
                aria-hidden="true"
              >
                {step.num}
              </p>
              <h3 className="font-display uppercase text-foreground-secondary text-subhead leading-none mb-3">
                {step.title}
              </h3>
              <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </Section>
  )
}
