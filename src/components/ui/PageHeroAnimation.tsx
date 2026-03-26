'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export function PageHeroAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })

      tl.fromTo(
        '.page-hero-eyebrow',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
        .fromTo(
          '.page-hero-line',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12 },
          '-=0.2'
        )
        .fromTo(
          '.page-hero-sub',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        )
    }, ref)

    return () => ctx.revert()
  }, [])

  return <div ref={ref}>{children}</div>
}
