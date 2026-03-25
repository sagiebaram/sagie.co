import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { PillarIcon } from '@/components/ui/PillarIcon'
import { PERSONAS } from '@/constants/personas'

export function WhoItsFor() {
  return (
    <Section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle">
        {PERSONAS.map((persona, i) => (
          <AnimatedSection
            key={persona.name}
            delay={i * 0.08}
            className="group bg-surface flex flex-col gap-5 hover:bg-surface-hover transition-colors duration-200 cursor-default px-8 py-10"
          >
            <div className="size-8">
              <PillarIcon name={persona.name} />
            </div>
            <p className="font-bebas uppercase text-silver group-hover:text-white transition-colors duration-150 text-persona tracking-heading">
              {persona.name}
            </p>
            <p className="font-dm text-ink-9 text-body font-light leading-[1.7]">
              {persona.line}
            </p>
          </AnimatedSection>
        ))}
      </div>
    </Section>
  )
}
