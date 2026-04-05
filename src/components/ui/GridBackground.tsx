'use client'

import { useEffect, useRef } from 'react'
import { getGSAP } from '@/lib/gsap'

export function GridBackground({ parallax }: { parallax?: boolean } = {}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!parallax) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: ReturnType<typeof import('gsap').gsap.context> | undefined

    const init = async () => {
      const { gsap, ScrollTrigger } = await getGSAP()

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
      className={`grid-bg absolute z-0 pointer-events-none inset-0${parallax ? ' -top-[15%] -bottom-[15%]' : ''}`}
    />
  )
}
