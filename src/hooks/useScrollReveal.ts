'use client'

import { useEffect, useRef } from 'react'

export interface UseScrollRevealOptions {
  y?: number
  duration?: number
  delay?: number
  stagger?: number
  selector?: string
  filterKey?: string
}

/**
 * Scroll-reveal hook using IntersectionObserver + CSS transitions.
 * Replaces GSAP ScrollTrigger to eliminate blank scroll zones.
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const { y = 24, duration = 0.6, delay = 0, stagger = 0, selector, filterKey } = options
  const isFirstRender = useRef(true)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      // Show everything immediately
      const targets = selector
        ? (Array.from(currentRef.querySelectorAll(selector)) as HTMLElement[])
        : [currentRef]
      targets.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return
    }

    // Set initial hidden state
    const targets = selector
      ? (Array.from(currentRef.querySelectorAll(selector)) as HTMLElement[])
      : [currentRef]

    targets.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = `translateY(${y}px)`
      el.style.willChange = 'opacity, transform'
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          // Reveal all targets with stagger
          targets.forEach((el, i) => {
            const totalDelay = delay + i * stagger
            el.style.transition = `opacity ${duration}s cubic-bezier(0.33, 1, 0.68, 1) ${totalDelay}s, transform ${duration}s cubic-bezier(0.33, 1, 0.68, 1) ${totalDelay}s`
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          })

          // Clean up will-change after animations complete
          const maxDelay = delay + (targets.length - 1) * stagger + duration
          setTimeout(() => {
            targets.forEach((el) => { el.style.willChange = '' })
          }, maxDelay * 1000)

          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    )

    observer.observe(currentRef)

    return () => observer.disconnect()
  }, [y, duration, delay, stagger, selector])

  // Filter-key effect: fade out and back in when filter changes (e.g. BlogFilter)
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

      if (selector) {
        el.querySelectorAll(selector).forEach((child) => {
          ;(child as HTMLElement).style.opacity = '1'
        })
      }
    })

    return () => cancelAnimationFrame(rafId)
  }, [filterKey, selector])

  return ref
}
