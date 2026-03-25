import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { FINAL_CTA } from '@/constants/copy'

export function FinalCTA() {
  return (
    <Section className="py-[140px]">
      <AnimatedSection className="text-center mx-auto max-w-[700px]">
        <h2 className="font-display uppercase text-foreground mb-10 text-hero-cta leading-[0.9]">
          {FINAL_CTA.heading.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < 2 && <br />}
            </span>
          ))}
        </h2>

        <p className="font-display uppercase mb-6 text-quote tracking-ultra">
          {FINAL_CTA.acronym.map((part, i) => (
            <span key={i}>
              {part.letter === ' ' ? (
                <span className="text-silver">{part.letter}</span>
              ) : (
                <>
                  <span className="text-silver">{part.letter}</span>
                  <span className="text-foreground-ghost">{part.rest}</span>
                </>
              )}
            </span>
          ))}
        </p>

        <p className="font-body text-foreground-muted mb-12 text-subhead font-light leading-[1.7]">
          {FINAL_CTA.subtitle.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </p>

        <Button variant="primary">{FINAL_CTA.cta}</Button>
      </AnimatedSection>
    </Section>
  )
}
