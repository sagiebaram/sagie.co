import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
  priority?: boolean
  className?: string
  maxHeight?: number
}

export function Logo({
  width = 100,
  height = 28,
  priority = false,
  className,
  maxHeight,
}: LogoProps) {
  return (
    <Image
      src="/logo-white.png"
      alt="SAGIE"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ width: 'auto', height: 'auto', maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    />
  )
}
