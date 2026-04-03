'use client'

import { useEffect, useRef } from 'react'
import { getGSAP } from '@/lib/gsap'

interface CountUpProps {
  end: number
  suffix?: string
  duration?: number
}

export function CountUp({ end, suffix = '', duration = 1.5 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      if (ref.current) ref.current.textContent = Math.round(end) + suffix
      return
    }

    let ctx: any

    const init = async () => {
      const { gsap } = await getGSAP()

      ctx = gsap.context(() => {
        const obj = { value: 0 }
        gsap.to(obj, {
          value: end,
          duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (ref.current) {
              ref.current.textContent = Math.round(obj.value) + suffix
            }
          },
        })
      }, ref)
    }

    init()

    return () => { ctx?.revert() }
  }, [end, suffix, duration])

  return <span ref={ref}>0{suffix}</span>
}
