import { cn } from '@/lib/utils'
import type { ButtonVariant } from '@/types'

interface ButtonProps extends React.ComponentPropsWithoutRef<'a'> {
  variant?: ButtonVariant
  children: React.ReactNode
}

const base = 'inline-flex items-center gap-2.5 font-body text-label tracking-label uppercase font-medium border border-transparent transition-all duration-300 cursor-pointer whitespace-nowrap'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-background px-[26px] py-[14px] hover:bg-silver hover:-translate-y-px',
  outline:
    'text-ink border-line-strong px-[26px] py-[14px] hover:bg-ink hover:text-background hover:border-ink hover:-translate-y-px',
  ghost:
    'text-ink-soft border-b-line-strong px-0 py-[14px] hover:text-ink hover:-translate-y-px',
}

export function Button({ variant = 'primary', children, className, href = '#', ...rest }: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </a>
  )
}
