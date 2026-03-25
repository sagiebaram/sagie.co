import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { MANIFESTO } from '@/constants/copy'

export function Manifesto() {
  return (
    <Section>
      <AnimatedSection>
        <Eyebrow>The Manifesto</Eyebrow>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="max-w-[620px]">
        {MANIFESTO.statements.map((statement, i) => (
          <div key={i} className="py-8 border-b border-border-subtle">
            <p className="font-body text-foreground-secondary text-manifesto font-light leading-[1.6]">
              {statement.text}
              <span className="text-foreground">{statement.highlight}</span>
            </p>
          </div>
        ))}

        <div className="py-8">
          <p className="font-body text-foreground text-manifesto font-light leading-[1.6]">
            {MANIFESTO.closer}
          </p>
        </div>
      </AnimatedSection>
    </Section>
  )
}
