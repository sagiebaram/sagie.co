'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { BELIEF } from '@/constants/copy'

export function Belief() {
  const ref = useScrollReveal({
    selector: '.belief-line',
    stagger: 0.2,
    y: 16,
    duration: 0.7,
  })

  return (
    <Section>
      <Eyebrow>The Belief</Eyebrow>

      <div ref={ref} className="max-w-[620px]">
        {BELIEF.statements.map((statement, i) => (
          <div key={i} className="belief-line py-8 border-b border-border-subtle">
            <p className="font-body text-foreground-muted text-heading font-light leading-body">
              {statement.text}
              <span className="text-silver">{statement.highlight}</span>
            </p>
          </div>
        ))}

        <div className="belief-line py-8">
          <p className="font-body text-silver text-heading font-light leading-body">
            {BELIEF.closer}
          </p>
        </div>
      </div>
    </Section>
  )
}
