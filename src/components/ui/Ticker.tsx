'use client'

import type { ReactNode } from 'react'
import { useId } from 'react'

export interface TickerProps {
  /** Ordered list of strings rendered between separators. */
  items: readonly string[]
  /**
   * Content rendered between adjacent items. Defaults to a gold diamond.
   * Rendered twice: once in the primary copy, once in the duplicate used to
   * produce a seamless loop.
   */
  separator?: ReactNode
  /** Loop duration in seconds. Lower = faster. Defaults to 28s (matches mockup). */
  durationSeconds?: number
  /** Extra className merged onto the outer band. */
  className?: string
  /** Optional id — mostly useful for tests. */
  id?: string
}

/**
 * Horizontal marquee / ticker band.
 *
 * - CSS animation only (no GSAP, no JS ticker loop).
 * - Respects `prefers-reduced-motion: reduce` (animation pauses).
 * - Pauses on hover / keyboard focus inside the band.
 * - Duplicates its item list so `translateX(-50%)` produces a seamless loop.
 *
 * Closes Sprint 04-07 carryover B-2: shared reusable ticker primitive.
 */
export function Ticker({
  items,
  separator = <span aria-hidden="true">◆</span>,
  durationSeconds = 28,
  className,
  id,
}: TickerProps) {
  const uid = useId()
  const animationName = `ticker-${uid.replace(/[:]/g, '')}`

  const renderRun = (key: string) => (
    <span key={key} className="inline-flex items-center whitespace-nowrap" aria-hidden={key === 'clone' ? true : undefined}>
      {items.map((item, idx) => (
        <span key={`${key}-${idx}`} className="inline-flex items-center">
          <span className="px-3">{item}</span>
          <span className="text-[color:var(--ticker-sep,#C9A84C)] px-1">
            {separator}
          </span>
        </span>
      ))}
    </span>
  )

  return (
    <div
      id={id}
      role="marquee"
      aria-label={`Contribution areas: ${items.join(', ')}`}
      className={`ticker-band relative overflow-hidden border-y border-border-subtle py-[10px] ${className ?? ''}`}
      style={{
        // Expose the computed animation name to the inner track.
        ['--ticker-anim' as string]: animationName,
        ['--ticker-duration' as string]: `${durationSeconds}s`,
      }}
    >
      <style>{`
        @keyframes ${animationName} {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-band .ticker-track {
          display: inline-flex;
          white-space: nowrap;
          animation: ${animationName} var(--ticker-duration) linear infinite;
          will-change: transform;
        }
        .ticker-band:hover .ticker-track,
        .ticker-band:focus-within .ticker-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-band .ticker-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="ticker-track font-body uppercase text-[11px] tracking-[0.14em] text-foreground-muted">
        {renderRun('primary')}
        {renderRun('clone')}
      </div>
    </div>
  )
}
