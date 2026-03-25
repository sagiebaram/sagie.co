import { cn } from '@/lib/utils'

interface EyebrowProps extends React.ComponentPropsWithoutRef<'p'> {
  children: React.ReactNode
}

export function Eyebrow({ children, className, ...rest }: EyebrowProps) {
  return (
    <p
      className={cn('font-dm uppercase text-ink-10 mb-6 text-label tracking-eyebrow', className)}
      {...rest}
    >
      {children}
    </p>
  )
}
