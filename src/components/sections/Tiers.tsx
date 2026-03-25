import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { TIERS } from '@/constants/tiers'
import { TIERS_EYEBROW } from '@/constants/copy'

export function Tiers() {
  return (
    <Section>
      <AnimatedSection>
        <Eyebrow>{TIERS_EYEBROW}</Eyebrow>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px mt-8 bg-border-default">
        {TIERS.map((tier, i) => (
          <AnimatedSection
            key={tier.name}
            delay={i * 0.08}
            className="group flex flex-col gap-5 p-10 transition-colors duration-200 hover:bg-background-card-featured bg-background"
          >
            <div>
              <p className="font-body uppercase mb-1.5 text-foreground-dim group-hover:text-foreground-muted transition-colors duration-150 text-label tracking-spaced">
                {tier.tag}
              </p>
              <p className="font-display uppercase text-foreground-muted group-hover:text-silver transition-colors duration-150 text-tier tracking-heading">
                {tier.name}
              </p>
            </div>

            <p className="font-body flex-1 text-foreground-dim group-hover:text-foreground-muted transition-colors duration-150 text-body font-light leading-[1.75]">
              {tier.desc}
            </p>

            <span
              className="font-body uppercase inline-block text-caption tracking-mid"
              style={{
                color: tier.ctaActive ? 'var(--silver)' : 'var(--text-ghost)',
                cursor: tier.ctaActive ? 'pointer' : 'default',
                borderBottom: tier.ctaActive ? '0.5px solid var(--text-muted)' : 'none',
              }}
            >
              {tier.cta}
            </span>
          </AnimatedSection>
        ))}
      </div>
    </Section>
  )
}
