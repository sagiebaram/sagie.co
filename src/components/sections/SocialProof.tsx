'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CountUp } from '@/components/ui/CountUp'
import { GlobeNetwork } from '@/components/GlobeNetwork'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { SOCIAL_STATS } from '@/constants/copy'

const STAT_VALUES: Record<string, { end: number; suffix: string }> = {
  '200+': { end: 200, suffix: '+' },
  '1': { end: 1, suffix: '' },
}

export function SocialProof() {
  const ref = useScrollReveal({ y: 24, duration: 0.6 })

  return (
    <Section>
      <Eyebrow>The Network</Eyebrow>

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-default mt-8">
        {SOCIAL_STATS.map((stat) => {
          const parsed = STAT_VALUES[stat.value]
          return (
            <div key={stat.label} className="bg-background px-10 py-12">
              <p className="font-display text-silver text-stat leading-none">
                {parsed ? (
                  <CountUp end={parsed.end} suffix={parsed.suffix} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="font-body uppercase text-foreground-ghost mt-3 text-caption tracking-label">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>

      <GlobeNetwork />
    </Section>
  )
}
