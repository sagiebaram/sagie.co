'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

export function GSAPCleanup() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
