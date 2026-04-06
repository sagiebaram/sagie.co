import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CardTilt } from '@/components/ui/CardTilt'
import { PILLARS } from '@/constants/pillars'

const PILLAR_GLOW: Record<string, string> = {
  ECO: '#7A9E7E',
  SOLUTIONS: '#1565C0',
  VENTURES: '#757575',
}

export function Pillars() {
  return (
    <Section>
      <Eyebrow>The Pillars</Eyebrow>

      <ScrollReveal selector=".pillar-row" stagger={0.1} y={20} duration={0.5}>
        {PILLARS.map((pillar) => (
          <CardTilt
            key={pillar.word}
            glowColor={PILLAR_GLOW[pillar.word]}
            className="pillar-row group py-8 border-b border-border-subtle"
          >
            {/* Desktop 2-col (hidden from screen readers — mobile version is canonical) */}
            <div className="relative z-1 hidden md:grid items-start" aria-hidden="true" style={{ gridTemplateColumns: '260px 1fr' }}>
              <div>
                <h3 className="font-display uppercase text-pillar leading-none tracking-heading">
                  <span className="text-foreground-muted">SAGIE </span>
                  <span className="text-silver group-hover:text-foreground transition-colors duration-150">
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
            <div className="relative z-1 md:hidden flex flex-col gap-3">
              <h3 className="font-display uppercase text-founder leading-none">
                <span className="text-foreground-muted">SAGIE </span>
                <span className="text-silver">{pillar.word}</span>
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
          </CardTilt>
        ))}
      </ScrollReveal>
    </Section>
  )
}
