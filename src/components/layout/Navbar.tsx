import { Logo } from '@/components/ui/Logo'
import { NAV_LINKS } from '@/constants/copy'

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background-nav backdrop-blur-[12px] border-b border-border-strong"
    >
      <div className="max-w-[880px] mx-auto px-8 flex items-center justify-between h-16">
        <Logo width={100} height={28} maxHeight={36} priority />
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body uppercase text-foreground-muted hover:text-silver transition-colors duration-150 text-label tracking-label"
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="#"
          className="font-body uppercase bg-white [color:black] hover:opacity-85 transition-colors duration-150 text-label tracking-button px-[22px] py-2.5"
        >
          Apply
        </a>
      </div>
    </nav>
  )
}
