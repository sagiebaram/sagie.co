'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface CountUpProps {
  end: number
  suffix?: string
  duration?: number
}

export function CountUp({ end, suffix = '', duration = 1.5 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      if (ref.current) ref.current.textContent = Math.round(end) + suffix
      return
    }

    const ctx = gsap.context(() => {
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

    return () => ctx.revert()
  }, [end, suffix, duration])

  return <span ref={ref}>0{suffix}</span>
}
