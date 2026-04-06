'use client'

import { useEffect } from 'react'
import { getGSAP } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
    // Let the browser handle scroll restoration natively on back/forward.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto'
    }

    // On reload, scroll to top to prevent the browser from restoring a
    // stale position before the page has fully rendered.
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (navEntry?.type === 'reload') {
      window.scrollTo(0, 0)
    }

    const handlePageHide = async () => {
      const { ScrollTrigger } = await getGSAP()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
    const handlePageShow = async (e: PageTransitionEvent) => {
      if (e.persisted) {
        const { ScrollTrigger } = await getGSAP()
        ScrollTrigger.refresh()
      }
    }
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
      getGSAP().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach(t => t.kill())
      })
    }
  }, [])

  return null
}
