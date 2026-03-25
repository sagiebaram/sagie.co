import { cn } from '@/lib/utils'
import type { ButtonVariant } from '@/types'

interface ButtonProps extends React.ComponentPropsWithoutRef<'a'> {
  variant?: ButtonVariant
  children: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-[#0A0A0A] hover:bg-gray-200 text-button tracking-button px-[34px] py-4',
  ghost:
    'text-foreground-muted hover:text-silver text-button tracking-button border-b border-border-default',
  outline:
    'border border-silver text-silver hover:bg-silver hover:text-background text-button tracking-button px-[34px] py-4',
}

export function Button({ variant = 'primary', children, className, href = '#', ...rest }: ButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-block font-body uppercase transition-colors duration-150',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}
