'use client'

import { useEffect, useRef, useState } from 'react'

export interface SectionNavItem {
  id: string
  label: string
}

interface SectionNavProps {
  items: SectionNavItem[]
}

/**
 * Fixed dot nav on the right edge of the viewport.
 * Highlights the active section via IntersectionObserver.
 * Labels always visible at low opacity, full opacity on hover/active.
 * Hidden on mobile and when prefers-reduced-motion is set.
 */
export function SectionNav({ items }: SectionNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const [visible, setVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

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

    return () => {
      showObserver.disconnect()
      observerRef.current?.disconnect()
    }
  }, [items])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-3 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      {items.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="group flex items-center gap-2"
            aria-label={`Scroll to ${item.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className="font-body text-label uppercase tracking-widest transition-all duration-200 origin-right group-hover:opacity-100"
              style={{
                color: isActive ? 'var(--silver)' : 'var(--text-dim)',
                opacity: isActive ? 1 : 0.35,
              }}
            >
              {item.label}
            </span>
            <span
              className="block shrink-0 rounded-full transition-all duration-200 group-hover:opacity-100"
              style={{
                width: isActive ? 8 : 5,
                height: isActive ? 8 : 5,
                backgroundColor: isActive ? 'var(--silver)' : 'var(--text-dim)',
                opacity: isActive ? 1 : 0.5,
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}
