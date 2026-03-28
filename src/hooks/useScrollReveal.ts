'use client'

import { useLayoutEffect, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export interface UseScrollRevealOptions {
  y?: number
  duration?: number
  delay?: number
  stagger?: number
  selector?: string
  filterKey?: string
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const { y = 24, duration = 0.6, delay = 0, stagger = 0, selector, filterKey } = options
  const isFirstRender = useRef(true)

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

  useEffect(() => {
    if (filterKey === undefined) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const el = ref.current
    if (!el) return

    el.style.opacity = '0'
    el.style.transition = ''

    const rafId = requestAnimationFrame(() => {
      el.style.transition = 'opacity 200ms ease-out'
      el.style.opacity = '1'
    })

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [filterKey])

  return ref
}
