import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { TIERS } from '@/constants/tiers'
import { TIERS_EYEBROW } from '@/constants/copy'

const TIER_STYLES: Record<string, { bg: string; hover: string; tag: string; name: string; desc: string; cta: string }> = {
  Explorer: {
    bg: '',
    hover: 'hover:bg-background-card-featured',
    tag: 'var(--text-muted)',
    name: 'var(--text-secondary)',
    desc: 'var(--text-muted)',
    cta: 'var(--text-secondary)',
  },
  Builder: {
    bg: '',
    hover: 'hover:bg-background-card-featured',
    tag: 'var(--silver)',
    name: 'var(--silver)',
    desc: 'var(--text-muted)',
    cta: 'var(--silver)',
  },
  Shaper: {
    bg: '',
    hover: 'hover:bg-background-card-featured',
    tag: 'var(--text-muted)',
    name: 'var(--text-secondary)',
    desc: 'var(--text-muted)',
    cta: 'var(--text-dim)',
  },
}

export function Tiers() {
  return (
    <Section>
      <Eyebrow>{TIERS_EYEBROW}</Eyebrow>

      <ScrollReveal selector=".tier-card" stagger={0.12} y={24} duration={0.6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mt-8">
        {TIERS.map((tier) => {
          const styles = TIER_STYLES[tier.name] ?? TIER_STYLES.Explorer!
          return (
            <div
              key={tier.name}
              className={`tier-card group flex flex-col gap-5 p-10 transition-colors duration-200 border border-border-default ${styles.hover} ${styles.bg}`}
            >
              <div>
                <p
                  className="font-body uppercase mb-1.5 text-label tracking-spaced"
                  style={{ color: styles.tag }}
                >
                  {tier.tag}
                </p>
                <h3
                  className="font-display uppercase text-tier tracking-heading"
                  style={{ color: styles.name }}
                >
                  {tier.name}
                </h3>
              </div>

              <p
                className="font-body flex-1 text-body font-light leading-[1.75]"
                style={{ color: styles.desc }}
              >
                {tier.desc}
              </p>

              {tier.ctaActive ? (
                <a
                  href="/apply"
                  className="font-body uppercase inline-block text-caption tracking-mid hover:text-silver hover:-translate-y-px transition-all duration-150"
                  style={{
                    color: styles.cta,
                    borderBottom: '0.5px solid var(--text-muted)',
                  }}
                >
                  {tier.cta}
                </a>
              ) : (
                <span
                  className="font-body uppercase inline-block text-caption tracking-mid"
                  style={{
                    color: styles.cta,
                    cursor: 'default',
                  }}
                >
                  {tier.cta}
                </span>
              )}
            </div>
          )
        })}
      </ScrollReveal>
    </Section>
  )
}
