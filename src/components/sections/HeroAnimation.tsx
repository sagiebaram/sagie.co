'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export function HeroAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      tl.fromTo(
        '.hero-line',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
        }
      )
        .fromTo(
          '.hero-body',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 },
          '-=0.2'
        )
    }, ref)

    return () => ctx.revert()
  }, [])

  return <div ref={ref}>{children}</div>
}
