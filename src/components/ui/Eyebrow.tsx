import { cn } from '@/lib/utils'

interface EyebrowProps extends React.ComponentPropsWithoutRef<'p'> {
  children: React.ReactNode
}

export function Eyebrow({ children, className, ...rest }: EyebrowProps) {
  return (
    <p
      className={cn('font-body uppercase text-foreground-muted mb-6 text-label tracking-eyebrow', className)}
      {...rest}
    >
      {children}
    </p>
  )
}
