import Image from 'next/image'
import { NAV_LINKS } from '@/constants/copy'

export function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-surface-nav backdrop-blur-[12px] border-b border-border-subtle"
    >
      <div className="max-w-[880px] mx-auto px-8 flex items-center justify-between h-16">
        <div className="relative w-[100px] h-7">
          <Image src="/logo-white.png" alt="SAGIE" fill priority className="object-contain object-left" />
        </div>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-dm uppercase text-ink-10 hover:text-silver transition-colors duration-150 text-label tracking-label"
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="#"
          className="font-dm uppercase text-surface bg-silver hover:bg-white transition-colors duration-150 text-label tracking-button px-[22px] py-2.5"
        >
          Apply
        </a>
      </div>
    </nav>
  )
}
