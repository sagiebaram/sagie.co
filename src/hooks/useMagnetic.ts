'use client'

import { useEffect, useRef, useCallback } from 'react'

interface MagneticOptions {
  /** Distance in px at which the pull begins (default 80) */
  radius?: number | undefined
  /** Max displacement in px (default 8) */
  strength?: number | undefined
}

export function useMagnetic<T extends HTMLElement>({
  radius = 80,
  strength = 8,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null)
  const rafId = useRef(0)

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current
      if (!el) return

      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < radius) {
          const pull = 1 - dist / radius // 1 at center, 0 at edge
          const tx = dx * pull * (strength / radius)
          const ty = dy * pull * (strength / radius)
          el.style.transform = `translate(${tx}px, ${ty}px)`
          el.style.transition = 'transform 0.15s ease-out'
        } else {
          el.style.transform = ''
          el.style.transition = 'transform 0.25s ease-out'
        }
      })
    },
    [radius, strength],
  )

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(rafId.current)
    el.style.transform = ''
    el.style.transition = 'transform 0.25s ease-out'
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip on touch devices or reduced motion
    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouchOnly || prefersReduced) return

    // Listen on document so we detect approach before cursor enters the element
    document.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(rafId.current)
      document.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseMove, onMouseLeave])

  return ref
}
