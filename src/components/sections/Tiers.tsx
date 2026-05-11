import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { TIERS } from '@/constants/tiers'
import { TIERS_EYEBROW } from '@/constants/copy'

const TIER_BG: Record<string, string> = {
  Explorer: 'var(--bg)',
  Builder: 'var(--bg-elev-1)',
  Shaper: 'var(--bg-elev-2)',
}

export function Tiers() {
  return (
    <Section>
      <Eyebrow>{TIERS_EYEBROW}</Eyebrow>

      <ScrollReveal
        selector=".tier-card"
        stagger={0.12}
        y={24}
        duration={0.6}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mt-8 border border-line bg-line"
      >
        {TIERS.map((tier, i) => {
          const isBuilder = tier.name === 'Builder'
          return (
            <div
              key={tier.name}
              className={`tier-card flex flex-col gap-5 min-h-[320px] transition-colors duration-300 hover:bg-[var(--bg-card-hi)] ${isBuilder ? 'border-t-2 border-t-eco' : ''}`}
              style={{ background: TIER_BG[tier.name] ?? 'var(--bg)', padding: '40px 32px 32px' }}
            >
              <div className="flex justify-between items-center">
                <span className="text-caption text-ink-dim tracking-[0.08em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-micro tracking-micro uppercase text-ink-muted">
                  {tier.tag}
                </span>
              </div>

              <h3
                className="font-display uppercase text-ink"
                style={{ fontSize: 'clamp(40px, 4vw, 56px)', lineHeight: '0.9' }}
              >
                {tier.name}
              </h3>

              <p className="font-serif italic font-light text-ink-soft text-body-lg leading-[1.5] flex-1">
                {tier.desc}
              </p>

              <div className="mt-auto">
                {tier.ctaActive ? (
                  <span className="text-caption text-ink-dim tracking-[0.06em] cursor-default">
                    {tier.cta}
                  </span>
                ) : (
                  <span className="text-caption text-ink-dim tracking-[0.06em] cursor-default">
                    {tier.cta}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </ScrollReveal>
    </Section>
  )
}
