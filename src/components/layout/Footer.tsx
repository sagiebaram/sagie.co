'use client'

import { Logo } from '@/components/ui/Logo'
import { GridBackground } from '@/components/ui/GridBackground'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { FOOTER, SITE } from '@/constants/copy'


export function Footer() {
  return (
    <footer className="relative z-1 overflow-hidden border-t border-border-strong">
      <GridBackground parallax />
      <div className="relative z-10 max-w-[880px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-10 border-b border-border-subtle">

          <div>
            <p className="font-body uppercase text-foreground mb-4 text-label tracking-eyebrow">
              {FOOTER.navigate.label}
            </p>
            <ul className="space-y-2.5">
              {FOOTER.navigate.links.map((item) => (
                <li key={item.label}>
                  <TransitionLink href={item.url} className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
              <li>
                <a
                  href={SITE.founderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-silver hover:text-foreground transition-colors duration-150 text-body"
                >
                  {FOOTER.navigate.founderLink}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-body uppercase text-foreground mb-4 text-label tracking-eyebrow">
              {FOOTER.follow.label}
            </p>
            <ul className="space-y-2.5">
              {FOOTER.follow.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body uppercase text-foreground mb-4 text-label tracking-eyebrow">
              {FOOTER.contact.label}
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <TransitionLink href="/apply" className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                  Apply to Join
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/apply/chapter" className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                  Start a Chapter
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/contact" className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                  Contact
                </TransitionLink>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end sm:justify-between py-6 gap-4">
          <Logo width={160} height={45} className="-ml-6 -mb-2" />
          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex gap-4">
              <TransitionLink href="/privacy" className="font-body text-foreground-muted hover:text-silver transition-colors duration-150 text-caption">
                Privacy Policy
              </TransitionLink>
              <TransitionLink href="/terms" className="font-body text-foreground-muted hover:text-silver transition-colors duration-150 text-caption">
                Terms of Service
              </TransitionLink>
            </div>
            <p className="font-body text-white text-caption tracking-copyright mb-0">
              {FOOTER.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
