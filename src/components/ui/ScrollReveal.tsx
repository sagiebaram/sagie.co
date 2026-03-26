'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ScrollRevealProps {
  children: React.ReactNode
  y?: number
  duration?: number
  delay?: number
  stagger?: number
  selector?: string
  className?: string
}

export function ScrollReveal({ children, className, ...options }: ScrollRevealProps) {
  const ref = useScrollReveal(options)
  return <div ref={ref} className={className}>{children}</div>
}
