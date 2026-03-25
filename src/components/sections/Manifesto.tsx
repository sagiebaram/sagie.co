'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { MANIFESTO } from '@/constants/copy'

export function Manifesto() {
  const ref = useScrollReveal({
    selector: '.manifesto-line',
    stagger: 0.2,
    y: 16,
    duration: 0.7,
  })

  return (
    <Section>
      <Eyebrow>The Manifesto</Eyebrow>

      <div ref={ref} className="max-w-[620px]">
        {MANIFESTO.statements.map((statement, i) => (
          <div key={i} className="manifesto-line py-8 border-b border-border-subtle">
            <p className="font-body text-foreground-muted text-manifesto font-light leading-[1.6]">
              {statement.text}
              <span className="text-silver">{statement.highlight}</span>
            </p>
          </div>
        ))}

        <div className="manifesto-line py-8">
          <p className="font-body text-silver text-manifesto font-light leading-[1.6]">
            {MANIFESTO.closer}
          </p>
        </div>
      </div>
    </Section>
  )
}
