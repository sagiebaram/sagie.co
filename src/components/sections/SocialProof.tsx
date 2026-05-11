'use client'

import type { ReactNode } from 'react'
import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CountUp } from '@/components/ui/CountUp'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { SOCIAL_STATS } from '@/constants/copy'

const STAT_VALUES: Record<string, { end: number; suffix: string }> = {
  '883+': { end: 883, suffix: '+' },
  '1': { end: 1, suffix: '' },
  '5': { end: 5, suffix: '' },
}

export function SocialProof({ globe }: { globe?: ReactNode }) {
  const ref = useScrollReveal({ y: 24, duration: 0.6 })

  return (
    <Section className="overflow-visible">
      <Eyebrow>The Network</Eyebrow>

      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-px mt-8 border border-line bg-line">
        {SOCIAL_STATS.map((stat) => {
          const parsed = STAT_VALUES[stat.value]
          return (
            <div key={stat.label} className="bg-[var(--bg)] py-12 px-8 flex flex-col items-center justify-center min-h-[220px]">
              <p className="font-display text-ink flex items-start" style={{ fontSize: 'clamp(72px, 8vw, 120px)', lineHeight: 1 }}>
                {parsed ? (
                  <>
                    <CountUp end={parsed.end} suffix="" />
                    {parsed.suffix && (
                      <span className="text-eco text-[0.5em] ml-1 mt-1">{parsed.suffix}</span>
                    )}
                  </>
                ) : (
                  stat.value
                )}
              </p>
              <p className="font-body uppercase text-ink-muted mt-4 text-micro tracking-micro">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>

      {globe && (
        <div className="flex justify-center mt-8">
          {globe}
        </div>
      )}
    </Section>
  )
}
