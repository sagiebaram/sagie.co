'use client'

import { useEffect } from 'react'
import { getGSAP } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
    // Prevent the browser from restoring stale scroll positions on refresh.
    // Next.js App Router handles scroll restoration for client-side
    // back/forward navigations internally, so 'manual' is safe here.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
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
