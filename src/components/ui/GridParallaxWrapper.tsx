'use client'

import { useEffect, useRef } from 'react'

export function GridParallaxWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const init = async () => {
      const { getGSAP } = await import('@/lib/gsap')
      const { gsap } = await getGSAP()

      const el = ref.current
      const parent = el?.parentElement
      if (!el || !parent) return

      ctx = gsap.context(() => {
        gsap.to(el, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: parent,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }

    init()
    return () => { ctx?.revert() }
  }, [])

  return (
    <div ref={ref} className="absolute inset-y-[-15%] inset-x-0 z-0 pointer-events-none">
      {children}
    </div>
  )
}
