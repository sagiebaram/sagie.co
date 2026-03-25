'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PillarIcon } from '@/components/ui/PillarIcon'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { PERSONAS } from '@/constants/personas'

export function WhoItsFor() {
  const ref = useScrollReveal({
    selector: '.persona-card',
    stagger: 0.08,
    y: 24,
    duration: 0.6,
  })

  return (
    <Section>
      <Eyebrow>Who it&apos;s for</Eyebrow>

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-default mt-8">
        {PERSONAS.map((persona) => (
          <div
            key={persona.name}
            className="persona-card group bg-background flex flex-col gap-5 hover:bg-background-card-featured transition-colors duration-200 cursor-default px-8 py-10"
          >
            <div className="size-8">
              <PillarIcon name={persona.name} />
            </div>
            <p className="font-display uppercase text-silver group-hover:text-foreground transition-colors duration-150 text-persona tracking-heading">
              {persona.name}
            </p>
            <p className="font-body text-foreground-dim text-body font-light leading-[1.7]">
              {persona.line}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
