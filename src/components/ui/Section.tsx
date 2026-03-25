import { cn } from '@/lib/utils'
import { GridBackground } from '@/components/ui/GridBackground'

interface SectionProps extends React.ComponentPropsWithoutRef<'section'> {
  children: React.ReactNode
}

export function Section({ children, id, className, style, ...rest }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('relative overflow-hidden border-t border-border py-20 px-8', className)}
      style={style}
      {...rest}
    >
      <GridBackground />
      <div className="relative z-10 mx-auto max-w-[880px]">{children}</div>
    </section>
  )
}
