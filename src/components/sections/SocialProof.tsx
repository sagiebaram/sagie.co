import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { GlobeNetwork } from '@/components/GlobeNetwork'
import { SOCIAL_STATS } from '@/constants/copy'

export function SocialProof() {
  return (
    <Section>
      <AnimatedSection>
        <Eyebrow>The Network</Eyebrow>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-default mt-8">
          {SOCIAL_STATS.map((stat) => (
            <div key={stat.label} className="bg-background px-10 py-12">
              <p className="font-display text-silver text-stat leading-none">
                {stat.value}
              </p>
              <p className="font-body uppercase text-foreground-ghost mt-3 text-caption tracking-label">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <GlobeNetwork />
    </Section>
  )
}
