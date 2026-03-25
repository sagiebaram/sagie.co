import { cn } from '@/lib/utils'
import type { ButtonVariant } from '@/types'

interface ButtonProps extends React.ComponentPropsWithoutRef<'a'> {
  variant?: ButtonVariant
  children: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-silver text-surface hover:bg-white text-button tracking-button px-[34px] py-4',
  ghost:
    'text-ink-10 hover:text-silver text-button tracking-button border-b border-ink-3',
  outline:
    'border border-silver text-silver hover:bg-silver hover:text-surface text-button tracking-button px-[34px] py-4',
}

export function Button({ variant = 'primary', children, className, href = '#', ...rest }: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-block font-dm uppercase transition-colors duration-150',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}
