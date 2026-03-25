import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { PILLARS } from '@/constants/pillars'

export function Pillars() {
  return (
    <Section>
      {PILLARS.map((pillar, i) => (
        <AnimatedSection
          key={pillar.word}
          delay={i * 0.08}
          className="group py-8 border-b border-border-subtle"
        >
          {/* Desktop 2-col */}
          <div className="hidden md:grid items-start" style={{ gridTemplateColumns: '260px 1fr' }}>
            <div>
              <p className="font-bebas uppercase text-pillar leading-none tracking-heading">
                <span className="text-ink-10">SAGIE </span>
                <span className="text-silver group-hover:text-white transition-colors duration-150">
                  {pillar.word}
                </span>
              </p>
              <p className="font-dm uppercase text-ink-5 mt-2 text-label tracking-label">
                {pillar.subtitle}
              </p>
            </div>
            <div className="px-8">
              <p className="font-dm text-white mb-2.5 text-subhead leading-[1.5]">
                {pillar.where}
              </p>
              <p className="font-dm text-ink-10 text-body font-light leading-[1.75]">
                {pillar.desc}
              </p>
            </div>
          </div>

          {/* Mobile stack */}
          <div className="md:hidden flex flex-col gap-3">
            <p className="font-bebas uppercase text-founder leading-none">
              <span className="text-ink-10">SAGIE </span>
              <span className="text-silver">{pillar.word}</span>
            </p>
            <p className="font-dm uppercase text-ink-5 text-label tracking-mid">
              {pillar.subtitle}
            </p>
            <p className="font-dm text-white text-subhead leading-[1.5]">
              {pillar.where}
            </p>
            <p className="font-dm text-ink-10 text-body font-light leading-[1.75]">
              {pillar.desc}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </Section>
  )
}
