'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { CHAPTER_SECTION } from '@/constants/copy'
import type { Chapter } from '@/lib/chapters'

function statusLabel(status: Chapter['status']): string {
  switch (status) {
    case 'Active': return 'Live'
    case 'Coming Soon': return 'Soon'
    case 'Planned': return 'Planned'
  }
}

export function ChapterMap({ chapters }: { chapters: Chapter[] }) {
  const leftRef = useScrollReveal({ y: 24, duration: 0.6 })
  const rightRef = useScrollReveal({ y: 24, duration: 0.6, delay: 0.15 })

  return (
    <Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        <div ref={leftRef}>
          <Eyebrow>{CHAPTER_SECTION.eyebrow}</Eyebrow>
          <h2 className="font-display uppercase text-foreground mb-6 text-chapter leading-[0.95]">
            {CHAPTER_SECTION.heading.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h2>
          <p className="font-body text-ink-muted mb-10 text-body-lg font-light leading-[1.65] max-w-[380px]">
            {CHAPTER_SECTION.body}
          </p>
          <span className="notify-glow inline-block font-body uppercase text-label tracking-label px-[26px] py-[14px] cursor-default border border-silver/30 text-silver/70 hover:text-ink hover:border-ink transition-all duration-200" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
            Coming Soon
          </span>
        </div>

        <div ref={rightRef} className="grid grid-cols-2 gap-px bg-line border border-line">
          {chapters.map((chapter) => {
            const isLive = chapter.status === 'Active'
            return (
              <div
                key={chapter.id}
                className="bg-[var(--bg)] flex flex-col justify-between min-h-[140px] p-6 transition-colors duration-200 hover:bg-[var(--bg-card)]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-[7px] h-[7px] rounded-full shrink-0 ${isLive ? 'chapter-dot-live' : ''}`}
                    style={{
                      background: isLive ? 'var(--eco)' : 'var(--ink-dim)',
                      boxShadow: isLive ? '0 0 10px var(--eco)' : 'none',
                    }}
                  />
                  <span className="text-micro tracking-micro uppercase text-ink-muted">
                    {statusLabel(chapter.status)}
                  </span>
                </div>
                <div className="mt-auto">
                  <p className="font-display uppercase text-ink text-[32px] leading-none tracking-[-0.01em] mb-1">
                    {chapter.name}
                  </p>
                  {chapter.description && (
                    <p className="text-caption text-ink-muted tracking-[0.04em]">
                      {chapter.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
