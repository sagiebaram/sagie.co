'use client'

import { useCardTilt, type UseCardTiltOptions } from '@/hooks/useCardTilt'

interface CardTiltProps extends UseCardTiltOptions {
  children: React.ReactNode
  className?: string
}

/**
 * Client wrapper that applies scale + glow on hover.
 * Use around individual cards (like ScrollReveal wraps groups).
 */
export function CardTilt({ children, className, ...options }: CardTiltProps) {
  const ref = useCardTilt(options)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
