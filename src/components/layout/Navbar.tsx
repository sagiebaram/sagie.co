'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { NAV_LINKS } from '@/constants/copy'

const NAV_ROUTES: Record<string, string> = {
  ECO: '/eco',
  Solutions: '/solutions',
  Ventures: '/ventures',
  Events: '/events',
  Resources: '/resources',
  Blog: '/blog',
}

function navHref(item: string) {
  return NAV_ROUTES[item] ?? `#${item.toLowerCase()}`
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background-nav backdrop-blur-md border-b border-border-strong"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-9999 focus:bg-background focus:text-foreground focus:p-4 focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <div className="max-w-[960px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <a href="/">
          <Image
            src="/sagie_logo_nav.png"
            alt="SAGIE"
            width={171}
            height={38}
            priority
            style={{ width: '171px', height: '38px' }}
          />
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={navHref(item)}
              className="font-body uppercase text-foreground-secondary hover:text-silver hover:-translate-y-px transition-all duration-150 text-label tracking-label"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/apply"
            className="font-body uppercase border border-silver text-silver hover:bg-silver hover:text-background hover:-translate-y-px transition-all duration-150 text-label tracking-button px-[22px] py-2.5"
          >
            Apply to Join
          </a>

          {/* Mobile burger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className="block h-[1.5px] w-full bg-foreground transition-all duration-300 ease-in-out origin-center"
                style={{
                  transform: isOpen ? 'translateY(9.5px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block h-[1.5px] w-full bg-foreground transition-all duration-300 ease-in-out"
                style={{
                  opacity: isOpen ? 0 : 1,
                  transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
                }}
              />
              <span
                className="block h-[1.5px] w-full bg-foreground transition-all duration-300 ease-in-out origin-center"
                style={{
                  transform: isOpen ? 'translateY(-9.5px) rotate(-45deg)' : 'none',
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        aria-hidden={!isOpen}
        style={{
          maxHeight: isOpen ? '360px' : '0px',
          opacity: isOpen ? 1 : 0,
          borderTop: isOpen ? '1px solid var(--border-strong)' : '0px solid transparent',
        }}
      >
        <div className="bg-background-nav backdrop-blur-md px-6 py-6 flex flex-col gap-1">
          {NAV_LINKS.map((item, i) => (
            <a
              key={item}
              href={navHref(item)}
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
              className="font-body uppercase text-foreground-secondary hover:text-silver transition-all duration-200 text-label tracking-label py-3 border-b border-border-subtle"
              style={{
                transitionDelay: isOpen ? `${i * 60}ms` : '0ms',
                transform: isOpen ? 'translateX(0)' : 'translateX(-12px)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="/apply"
            onClick={() => setIsOpen(false)}
            tabIndex={isOpen ? 0 : -1}
            className="font-body uppercase text-silver hover:text-foreground transition-all duration-200 text-label tracking-label py-3"
            style={{
              transitionDelay: isOpen ? `${NAV_LINKS.length * 60}ms` : '0ms',
              transform: isOpen ? 'translateX(0)' : 'translateX(-12px)',
              opacity: isOpen ? 1 : 0,
            }}
          >
            Apply to Join
          </a>
        </div>
      </div>
    </nav>
  )
}
