'use client'

import { cn } from '@/lib/utils'
import { useMagnetic } from '@/hooks/useMagnetic'
import type { ButtonVariant } from '@/types'

interface ButtonProps extends React.ComponentPropsWithoutRef<'a'> {
  variant?: ButtonVariant
  children: React.ReactNode
  magnetic?: boolean | undefined
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-button-primary-bg [color:var(--color-button-primary-text)] hover:opacity-85 text-button tracking-button px-[34px] py-4',
  ghost:
    'text-foreground-muted hover:text-silver text-button tracking-button border-b border-border-default',
  outline:
    'border border-silver text-silver hover:bg-silver hover:text-background text-button tracking-button px-[34px] py-4',
}

export function Button({ variant = 'primary', magnetic, children, className, href = '#', ...rest }: ButtonProps) {
  const magneticRef = useMagnetic<HTMLDivElement>()

  const link = (
    <a
      href={href}
      className={cn(
        'inline-block font-body uppercase transition-all duration-150 hover:-translate-y-px',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )

  if (magnetic) {
    return (
      <div ref={magneticRef} style={{ display: 'inline-block' }}>
        {link}
      </div>
    )
  }

  return link
}
