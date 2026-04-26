'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { CHAPTER_SECTION } from '@/constants/copy'
import type { Chapter } from '@/lib/chapters'

type ChapterStatus = Chapter['status']

function statusToBadge(status: ChapterStatus): string {
  switch (status) {
    case 'Active': return 'Live'
    case 'Coming Soon': return 'Coming Soon'
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
          <p className="font-body text-foreground-muted mb-10 text-body-lg font-light leading-[1.75] max-w-[380px]">
            {CHAPTER_SECTION.body}
          </p>
          <span className="notify-glow inline-block font-body uppercase text-button tracking-button px-[34px] py-4 cursor-default border border-silver/30 text-silver/70 hover:text-foreground hover:border-foreground transition-all duration-200" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
            Notify Me
          </span>
        </div>

        <div ref={rightRef} className="flex flex-col border-t border-border-subtle max-h-none md:max-h-[360px] md:overflow-y-auto scrollbar-subtle">
          {chapters.map((chapter) => {
            const isLive = chapter.status === 'Active'
            const badge = statusToBadge(chapter.status)
            const hasChapterUrl = !!chapter.chapterUrl
            const hasWaitlistUrl = !!chapter.waitlistUrl

            return (
              <div
                key={chapter.id}
                className="py-5 border-b border-border-subtle"
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '20px',
                      letterSpacing: '0.06em',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {chapter.name}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      border: `0.5px solid ${
                        isLive
                          ? 'var(--text-primary)'
                          : 'rgba(255,255,255,0.2)'
                      }`,
                      color: isLive
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {badge}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      fontWeight: 300,
                    }}
                  >
                    {chapter.description ?? ''}
                  </span>
                  {hasChapterUrl ? (
                    <a
                      href={chapter.chapterUrl!}
                      className="hover:text-silver hover:-translate-y-px transition-all duration-150"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        borderBottom: '0.5px solid var(--border-subtle)',
                        paddingBottom: '1px',
                        textDecoration: 'none',
                      }}
                    >
                      View Chapter →
                    </a>
                  ) : hasWaitlistUrl ? (
                    <a
                      href={chapter.waitlistUrl!}
                      className="hover:text-silver hover:-translate-y-px transition-all duration-150"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        borderBottom: '0.5px solid var(--border-subtle)',
                        paddingBottom: '1px',
                        textDecoration: 'none',
                      }}
                    >
                      Join Waitlist →
                    </a>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
