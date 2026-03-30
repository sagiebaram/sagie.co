'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
    // Disable browser scroll restoration — always start at top on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const handlePageHide = () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
