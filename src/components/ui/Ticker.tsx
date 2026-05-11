import type { ReactNode } from 'react'

export interface TickerProps {
  /** Ordered list of strings rendered between separators. */
  items: readonly string[]
  /**
   * Content rendered between adjacent items. Defaults to a gold diamond.
   * Rendered inside each item so the clone gets one too.
   */
  separator?: ReactNode
  /**
   * Loop duration in seconds. Lower = snappier.
   * Revised default is 25s (v1 used 28s and felt slow per Sagie's review).
   */
  durationSeconds?: number
  /** Extra className merged onto the outer band. */
  className?: string
  /** Optional id — mostly useful for anchors / tests. */
  id?: string
}

/**
 * Horizontal marquee / ticker band.
 *
 * True CSS-only infinite loop:
 *   - The track renders the items list duplicated once ([...items, ...items]).
 *   - A `ticker-scroll` keyframe animates `transform: translateX(0) → -50%`.
 *   - When the first copy has scrolled fully off-screen, the second copy is
 *     exactly where the first started, so the loop is seamless.
 *   - Pauses on hover or keyboard focus inside the band.
 *   - Respects `prefers-reduced-motion: reduce`.
 *   - Overflow is clipped at the band so the animated track never pushes
 *     horizontal page scroll.
 *
 * Closes Sprint 04-07 carryover B-2 (reusable ticker primitive) and fixes the
 * v1 implementation which used a dynamic `useId`-derived keyframe and a
 * fragile `inline-flex` wrapper.
 */
export function Ticker({
  items,
  separator = <span aria-hidden="true">◆</span>,
  durationSeconds = 25,
  className,
  id,
}: TickerProps) {
  // Render the list twice so the translateX(-50%) keyframe produces a
  // seamless loop. A Fragment array is fine — React keys are stable per index.
  const doubled = [...items, ...items]

  return (
    <div
      id={id}
      role="marquee"
      aria-label={`Contribution areas: ${items.join(', ')}`}
      className={`ticker-band relative overflow-hidden border-y border-border-subtle py-[10px] w-full ${className ?? ''}`}
      style={{
        ['--ticker-duration' as string]: `${durationSeconds}s`,
      }}
    >
      <div className="ticker-track flex items-center whitespace-nowrap font-body uppercase text-[11px] tracking-[0.14em] text-foreground-muted">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center flex-shrink-0"
            aria-hidden={i >= items.length ? true : undefined}
          >
            <span className="px-4">{item}</span>
            <span className="text-[#C9A84C] px-1">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
