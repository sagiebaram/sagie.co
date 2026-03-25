import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { MANIFESTO } from '@/constants/copy'

export function Manifesto() {
  return (
    <Section>
      <AnimatedSection className="max-w-[620px]">
        {MANIFESTO.statements.map((statement, i) => (
          <div key={i} className="py-8 border-b border-border-subtle">
            <p className="font-dm text-ink-12 text-manifesto font-light leading-[1.6]">
              {statement.text}
              <span className="text-white">{statement.highlight}</span>
            </p>
          </div>
        ))}

        <div className="py-8">
          <p className="font-dm text-white text-manifesto font-light leading-[1.6]">
            {MANIFESTO.closer}
          </p>
        </div>

        <p className="font-dm text-ink-6 mt-8 text-caption tracking-spaced">
          {MANIFESTO.tagline}
        </p>
      </AnimatedSection>
    </Section>
  )
}
