'use client'

import { useEffect, useRef } from 'react'
import { getGSAP } from '@/lib/gsap'

export function HeroAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // No animation — ensure content is visible and accessible
      if (ref.current) ref.current.removeAttribute('aria-hidden')
      return
    }

    // Hide from assistive tech while animating (content is opacity:0)
    if (ref.current) ref.current.setAttribute('aria-hidden', 'true')

    let ctx: any

    const init = async () => {
      const { gsap } = await getGSAP()

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          delay: 2.0,
          onComplete: () => {
            ref.current?.removeAttribute('aria-hidden')
          },
        })

        tl.fromTo(
          '.hero-line',
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
          }
        )
          .fromTo(
            '.hero-body',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.35'
          )
          .fromTo(
            '.hero-cta',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
            '-=0.2'
          )
      }, ref)
    }

    init()

    return () => { ctx?.revert() }
  }, [])

  return <div ref={ref}>{children}</div>
}
