'use client'

import { useEffect, useRef } from 'react'

export interface UseCardTiltOptions {
  /** Scale factor on hover (default 1.04) */
  scale?: number
  /** Radial glow color on hover (CSS color string) */
  glowColor?: string | undefined
}

/**
 * Card hover hook — scale + cursor-following radial glow.
 * Returns a ref to attach to the card element.
 *
 * Respects prefers-reduced-motion and disables on touch-only devices.
 */
export function useCardTilt(options: UseCardTiltOptions = {}) {
  const { scale = 1.04, glowColor } = options

  const ref = useRef<HTMLDivElement>(null)
  const rafId = useRef(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchOnly = window.matchMedia('(hover: none)').matches

    if (prefersReduced || isTouchOnly) return

    const el = ref.current
    if (!el) return

    // Set base transform so there's no jump on first hover
    el.style.willChange = 'transform'
    el.style.transform = 'scale(1)'
    el.style.transition = 'transform 0.3s ease, border-color 0.3s'

    // Glow element setup (tracks cursor position)
    let glowEl: HTMLDivElement | null = null
    if (glowColor) {
      glowEl = document.createElement('div')
      glowEl.setAttribute('aria-hidden', 'true')
      Object.assign(glowEl.style, {
        position: 'absolute',
        inset: '0',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 0.3s',
        background: `radial-gradient(circle at 50% 50%, ${glowColor}22 0%, transparent 70%)`,
        zIndex: '0',
      })
      el.style.position = 'relative'
      el.style.overflow = 'hidden'
      el.prepend(glowEl)
    }

    const onMouseEnter = () => {
      el.style.transform = `scale(${scale})`
      if (glowEl) glowEl.style.opacity = '1'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!glowEl) return
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const pctX = ((e.clientX - r.left) / r.width) * 100
        const pctY = ((e.clientY - r.top) / r.height) * 100
        glowEl!.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, ${glowColor}33 0%, transparent 70%)`
      })
    }

    const onMouseLeave = () => {
      cancelAnimationFrame(rafId.current)
      el.style.transform = 'scale(1)'
      if (glowEl) {
        glowEl.style.opacity = '0'
      }
    }

    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(rafId.current)
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (glowEl && el.contains(glowEl)) {
        el.removeChild(glowEl)
      }
    }
  }, [scale, glowColor])

  return ref
}
