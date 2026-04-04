import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PILLARS } from '@/constants/pillars'

export function Pillars() {
  return (
    <Section>
      <Eyebrow>The Pillars</Eyebrow>

      <ScrollReveal selector=".pillar-row" stagger={0.1} y={20} duration={0.5}>
        {PILLARS.map((pillar) => (
          <div
            key={pillar.word}
            className="pillar-row group py-8 border-b border-border-subtle"
          >
            {/* Desktop 2-col */}
            <div className="hidden md:grid items-start" style={{ gridTemplateColumns: '260px 1fr' }}>
              <div>
                <h3 className="font-display uppercase text-pillar leading-none tracking-heading">
                  <span className="text-foreground-muted">SAGIE </span>
                  <span
                    className="transition-colors duration-150"
                    style={{ color: pillar.accent }}
                  >
                    {pillar.word}
                  </span>
                </h3>
                <p className="font-body uppercase text-foreground-muted mt-2 text-label tracking-label">
                  {pillar.subtitle}
                </p>
              </div>
              <div className="px-8">
                <p className="font-body text-foreground mb-2.5 text-subhead leading-[1.5]">
                  {pillar.where}
                </p>
                <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
                  {pillar.desc}
                </p>
              </div>
            </div>

            {/* Mobile stack */}
            <div className="md:hidden flex flex-col gap-3">
              <h3 className="font-display uppercase text-founder leading-none">
                <span className="text-foreground-muted">SAGIE </span>
                <span style={{ color: pillar.accent }}>{pillar.word}</span>
              </h3>
              <p className="font-body uppercase text-foreground-muted text-label tracking-mid">
                {pillar.subtitle}
              </p>
              <p className="font-body text-foreground text-subhead leading-[1.5]">
                {pillar.where}
              </p>
              <p className="font-body text-foreground-muted text-body font-light leading-[1.75]">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </ScrollReveal>
    </Section>
  )
}
