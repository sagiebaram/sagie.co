import { Section } from '@/components/ui/Section'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { GlobeNetwork } from '@/components/GlobeNetwork'
import { SOCIAL_STATS } from '@/constants/copy'

export function SocialProof() {
  return (
    <Section>
      <AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-subtle">
          {SOCIAL_STATS.map((stat) => (
            <div key={stat.label} className="bg-surface px-10 py-12">
              <p className="font-bebas text-silver text-stat leading-none">
                {stat.value}
              </p>
              <p className="font-dm uppercase text-ink-5 mt-3 text-caption tracking-label">
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
