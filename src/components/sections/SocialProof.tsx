'use client'

import type { ReactNode } from 'react'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CountUp } from '@/components/ui/CountUp'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { SOCIAL_STATS } from '@/constants/copy'

const STAT_VALUES: Record<string, { end: number; suffix: string }> = {
  '200+': { end: 200, suffix: '+' },
  '1': { end: 1, suffix: '' },
}

export function SocialProof({ globe }: { globe?: ReactNode }) {
  const ref = useScrollReveal({ y: 24, duration: 0.6 })

  return (
    <Section className="overflow-visible">
      <Eyebrow>The Network</Eyebrow>

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 mt-8">
        {SOCIAL_STATS.map((stat) => {
          const parsed = STAT_VALUES[stat.value]
          return (
            <div key={stat.label} className="py-12 text-center">
              <p className="font-display text-silver text-stat leading-none">
                {parsed ? (
                  <CountUp end={parsed.end} suffix={parsed.suffix} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="font-body uppercase text-foreground-muted mt-3 text-caption tracking-label">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>

      {globe && (
        <div className="hidden md:block">
          {globe}
        </div>
      )}
    </Section>
  )
}
