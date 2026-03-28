'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
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
