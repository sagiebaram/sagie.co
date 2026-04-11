import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CONTRIBUTE_V2_HOW_SECTION, CONTRIBUTE_V2_STEPS } from '@/constants/contribute-v2'

/**
 * "How It Works" for /contribute-v2 — 3 horizontal steps linked by a
 * thin gold rail.
 *
 * Distinct from v1's 4-card grid: this version uses a single-row timeline
 * look on desktop (number + rail running between the steps) and a stacked
 * vertical list on mobile.
 */
export function ContributeV2HowItWorks() {
  const { eyebrow, title } = CONTRIBUTE_V2_HOW_SECTION

  return (
    <Section id="v2-how">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display uppercase text-foreground-secondary text-pillar leading-none tracking-heading mb-12 max-w-[720px]">
        {title}
      </h2>

      <ScrollReveal selector=".step" stagger={0.1} y={18} duration={0.55}>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Horizontal gold rail — desktop only */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-0 right-0 top-5 h-px"
            style={{ background: 'linear-gradient(90deg, #C9A84C 0%, #C9A84C 40%, rgba(201,168,76,0.25) 100%)' }}
          />

          {CONTRIBUTE_V2_STEPS.map((step) => (
            <div key={step.num} className="step relative pt-0">
              {/* Gold rail node */}
              <div
                aria-hidden="true"
                className="relative mb-8 md:mb-10 w-[10px] h-[10px]"
                style={{
                  background: '#C9A84C',
                  borderRadius: '1px',
                  transform: 'rotate(45deg)',
                  boxShadow: '0 0 0 4px var(--bg), 0 0 16px rgba(201,168,76,0.35)',
                }}
              />
              <p
                className="font-body uppercase text-[10px] tracking-[0.22em] mb-3"
                style={{ color: '#C9A84C' }}
              >
                Step {step.num}
              </p>
              <h3 className="font-display uppercase text-foreground-secondary text-subhead leading-tight tracking-heading mb-4">
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
