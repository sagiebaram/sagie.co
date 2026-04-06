'use client'

import { useEffect } from 'react'
import { getGSAP } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
    // Let the browser handle scroll restoration natively on back/forward.
    // 'manual' was preventing scroll restore without implementing a replacement.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto'
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
