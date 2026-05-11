'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const COLUMNS = [
  {
    eyebrow: 'People',
    body: 'Connections that cross borders, industries, and backgrounds. Not networking — real relationships built on shared vision.',
  },
  {
    eyebrow: 'Trust',
    body: 'Trust builds ecosystems. Introductions that are earned, accountability that is lived, collaboration that compounds.',
  },
  {
    eyebrow: 'Collective',
    body: 'The collective always outlasts the individual. Building together beats building alone — that belief drives everything.',
  },
] as const

export function Belief() {
  const headingRef = useScrollReveal({ y: 24, duration: 0.7 })
  const gridRef = useScrollReveal({
    selector: '.belief-col',
    stagger: 0.15,
    y: 20,
    duration: 0.6,
  })

  return (
    <Section className="min-h-[80vh] flex flex-col justify-center py-32 border-t border-border-default">
      <Eyebrow>The Belief</Eyebrow>

      <h2
        ref={headingRef}
        className="font-display uppercase text-foreground text-hero leading-display mb-16 max-w-[900px]"
      >
        THE WORLD DOESN&rsquo;T NEED<br />MORE COMPETITION
      </h2>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-12">
        {COLUMNS.map((col) => (
          <div key={col.eyebrow} className="belief-col">
            <p className="font-body uppercase text-label tracking-eyebrow text-foreground-muted mb-4">
              {col.eyebrow}
            </p>
            <p className="font-body text-foreground-secondary text-body leading-body font-light">
              {col.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
