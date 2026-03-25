'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  style?: React.CSSProperties
}

export function AnimatedSection({ children, className, delay = 0, style }: AnimatedSectionProps) {
  const shouldReduce = useReducedMotion()

  const inner = (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
      className={style ? undefined : cn(className)}
    >
      {children}
    </motion.div>
  )

  if (style) {
    return (
      <div className={cn(className)} style={style}>
        {inner}
      </div>
    )
  }

  return inner
}
