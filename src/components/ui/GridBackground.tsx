'use client'

import { useEffect, useRef } from 'react'

export function GridBackground({ parallax }: { parallax?: boolean } = {}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!parallax) return
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
  }, [parallax])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`grid-bg absolute z-0 pointer-events-none${parallax ? ' inset-[-15%_0]' : ' inset-0'}`}
    />
  )
}
