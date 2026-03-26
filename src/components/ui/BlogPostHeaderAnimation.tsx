'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export function BlogPostHeaderAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })

      tl.fromTo(
        '.post-back',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
        .fromTo(
          '.post-meta',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.1
        )
        .fromTo(
          '.post-title',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0.15
        )
        .fromTo(
          '.post-author',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.4
        )
    }, ref)

    return () => ctx.revert()
  }, [])

  return <div ref={ref}>{children}</div>
}
