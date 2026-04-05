'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface SectionNavItem {
  id: string
  label: string
}

interface SectionNavProps {
  items: SectionNavItem[]
}

/**
 * Section navigation with two modes:
 * - Desktop: subtle dot nav fixed on the right edge, labels on hover
 * - Mobile: thin progress bar at the top with tappable section labels
 *
 * Both respect prefers-reduced-motion.
 */
export function SectionNav({ items }: SectionNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Show nav after scrolling past hero
    const showObserver = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry!.isIntersecting)
      },
      { threshold: 0 },
    )

    const heroEl = document.getElementById(items[0]?.id ?? '')
    if (heroEl) showObserver.observe(heroEl)

    // Track active section
    const sectionEls = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    const ratioMap = new Map<string, number>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMap.set(entry.target.id, entry.intersectionRatio)
        })

        let maxRatio = 0
        let maxId = ''
        ratioMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            maxId = id
          }
        })
        if (maxId) setActive(maxId)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sectionEls.forEach((el) => observerRef.current!.observe(el))

    // Scroll progress for mobile bar
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => {
      showObserver.disconnect()
      observerRef.current?.disconnect()
      window.removeEventListener('scroll', updateProgress)
    }
  }, [items, updateProgress])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeIndex = items.findIndex((item) => item.id === active)

  return (
    <>
      {/* ── Desktop: dot nav on right edge ── */}
      <nav
        aria-label="Page sections"
        className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-2.5 transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      >
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="group flex items-center gap-2.5 py-0.5"
              aria-label={`Scroll to ${item.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span
                className="font-body uppercase transition-all duration-300 origin-right group-hover:opacity-70 group-hover:translate-x-0"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: isActive ? 'var(--silver)' : 'var(--text-dim)',
                  opacity: isActive ? 0.6 : 0,
                  transform: isActive ? 'translateX(0)' : 'translateX(4px)',
                }}
              >
                {item.label}
              </span>
              <span
                className="block shrink-0 rounded-full transition-all duration-300 group-hover:opacity-60"
                style={{
                  width: isActive ? 6 : 3,
                  height: isActive ? 6 : 3,
                  backgroundColor: isActive ? 'var(--silver)' : 'var(--text-ghost)',
                  opacity: isActive ? 0.7 : 0.25,
                }}
              />
            </button>
          )
        })}
      </nav>

      {/* ── Mobile: progress bar + active label at top ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 md:hidden transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      >
        {/* Progress track */}
        <div className="h-[2px] bg-border-subtle">
          <div
            className="h-full transition-[width] duration-100 ease-linear"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: 'var(--silver)',
              opacity: 0.5,
            }}
          />
        </div>

        {/* Section label bar */}
        <div className="flex overflow-x-auto scrollbar-subtle bg-background/80 backdrop-blur-sm border-b border-border-subtle">
          {items.map((item, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className="shrink-0 px-3 py-2 transition-colors duration-200"
                aria-label={`Scroll to ${item.label}`}
              >
                <span
                  className="font-body uppercase whitespace-nowrap"
                  style={{
                    fontSize: '8px',
                    letterSpacing: '0.15em',
                    color: isActive ? 'var(--silver)' : 'var(--text-ghost)',
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
