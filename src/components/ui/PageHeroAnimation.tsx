'use client'

import { useEffect, useRef } from 'react'
import { getGSAP } from '@/lib/gsap'

export function PageHeroAnimation({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let ctx: any

    const init = async () => {
      const { gsap } = await getGSAP()

      ctx = gsap.context((self) => {
        const eyebrow = self.selector?.('.page-hero-eyebrow')
        const lines = self.selector?.('.page-hero-line')
        const sub = self.selector?.('.page-hero-sub')

        const tl = gsap.timeline({ delay: 0.15 })

        if (eyebrow?.length) {
          tl.fromTo(
            eyebrow,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          )
        }

        if (lines?.length) {
          tl.fromTo(
            lines,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12 },
            eyebrow?.length ? '-=0.2' : 0
          )
        }

        if (sub?.length) {
          tl.fromTo(
            sub,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            lines?.length ? '-=0.3' : (eyebrow?.length ? '-=0.1' : 0)
          )
        }
      }, ref)
    }

    init()

    return () => { ctx?.revert() }
  }, [])

  return <div ref={ref} id={id}>{children}</div>
}
