'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface LogoProps {
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function Logo({
  width = 100,
  height = 28,
  priority = false,
  className,
  maxHeight,
}: LogoProps & { maxHeight?: number }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const src = !mounted || resolvedTheme === 'dark' ? '/logo-white.png' : '/logo-black.png'

  return (
    <Image
      src={src}
      alt="SAGIE"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ width: 'auto', height: 'auto', maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    />
  )
}
