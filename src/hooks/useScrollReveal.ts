'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface UseScrollRevealOptions {
  y?: number
  duration?: number
  delay?: number
  stagger?: number
  selector?: string
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const { y = 24, duration = 0.6, delay = 0, stagger = 0, selector } = options

  useLayoutEffect(() => {
    if (!ref.current) return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return

    const ctx = gsap.context(() => {
      const currentRef = ref.current
      if (!currentRef) return

      const target = selector
        ? gsap.utils.toArray<Element>(selector, currentRef)
        : currentRef

      if (!target || (Array.isArray(target) && target.length === 0)) {
        return
      }

      gsap.fromTo(
        target as any,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power2.out',
          stagger,
          scrollTrigger: {
            trigger: currentRef,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [y, duration, delay, stagger, selector])

  return ref
}
