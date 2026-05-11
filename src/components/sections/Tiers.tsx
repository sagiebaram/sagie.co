import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CardTilt } from '@/components/ui/CardTilt'
import { TIERS } from '@/constants/tiers'
import { TIERS_EYEBROW } from '@/constants/copy'

const TIER_GLOW: Record<string, string> = {
  Explorer: '#9CA3AF',
  Builder: '#C0C0C0',
  Shaper: '#6B7280',
}

const TIER_STYLES: Record<string, { tag: string; name: string; desc: string; cta: string }> = {
  Explorer: {
    tag: 'var(--text-muted)',
    name: 'var(--text-secondary)',
    desc: 'var(--text-muted)',
    cta: 'var(--text-secondary)',
  },
  Builder: {
    tag: 'var(--silver)',
    name: 'var(--silver)',
    desc: 'var(--text-muted)',
    cta: 'var(--silver)',
  },
  Shaper: {
    tag: 'var(--text-muted)',
    name: 'var(--text-secondary)',
    desc: 'var(--text-muted)',
    cta: 'var(--text-muted)',
  },
}

export function Tiers() {
  return (
    <Section>
      <Eyebrow>{TIERS_EYEBROW}</Eyebrow>

      <ScrollReveal selector=".tier-card" stagger={0.12} y={24} duration={0.6} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mt-8">
        {TIERS.map((tier) => {
          const styles = TIER_STYLES[tier.name] ?? TIER_STYLES.Explorer!
          const isBuilder = tier.name === 'Builder'
          return (
            <CardTilt
              key={tier.name}
              glowColor={TIER_GLOW[tier.name]}
              className={`tier-card group flex flex-col gap-5 p-10 transition-colors duration-200 border border-border-default hover:bg-white/[0.02] ${isBuilder ? 'border-t-2 border-t-silver bg-white/[0.02]' : ''}`}
            >
              <div className="relative z-1">
                <p
                  className="font-body uppercase mb-1.5 text-label tracking-spaced"
                  style={{ color: isBuilder ? 'var(--silver)' : styles.tag }}
                >
                  {tier.tag}
                </p>
                <h3
                  className="font-display uppercase text-chapter tracking-heading"
                  style={{ color: styles.name }}
                >
                  {tier.name}
                </h3>
              </div>

              <p
                className="relative z-1 font-body flex-1 text-body font-light leading-body"
                style={{ color: styles.desc }}
              >
                {tier.desc}
              </p>

              <span
                className="relative z-1 font-body uppercase inline-block text-label tracking-mid"
                style={{
                  color: styles.cta,
                  cursor: 'default',
                }}
              >
                {tier.cta}
              </span>
            </CardTilt>
          )
        })}
      </ScrollReveal>
    </Section>
  )
}
