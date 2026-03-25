'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { TIERS } from '@/constants/tiers'
import { TIERS_EYEBROW } from '@/constants/copy'

export function Tiers() {
  const ref = useScrollReveal({
    selector: '.tier-card',
    stagger: 0.12,
    y: 24,
    duration: 0.6,
  })

  return (
    <Section>
      <Eyebrow>{TIERS_EYEBROW}</Eyebrow>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-px mt-8 bg-border-default">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="tier-card group flex flex-col gap-5 p-10 transition-colors duration-200 hover:bg-background-card-featured bg-background"
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
          </div>
        ))}
      </div>
    </Section>
  )
}
