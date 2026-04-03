import { Logo } from '@/components/ui/Logo'
import { GridBackground } from '@/components/ui/GridBackground'
import { FOOTER, SITE } from '@/constants/copy'

export function Footer() {
  return (
    <footer className="relative z-1 overflow-hidden border-t border-border-strong">
      <GridBackground />
      <div className="relative z-10 max-w-[880px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 py-16 border-b border-border-subtle">

          <div>
            <p className="font-body uppercase text-foreground mb-6 text-label tracking-eyebrow">
              {FOOTER.navigate.label}
            </p>
            <ul className="space-y-4">
              {FOOTER.navigate.links.map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                    {item}
                  </a>
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
            <p className="font-body uppercase text-foreground mb-6 text-label tracking-eyebrow">
              {FOOTER.follow.label}
            </p>
            <ul className="space-y-4">
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
            <p className="font-body uppercase text-foreground mb-6 text-label tracking-eyebrow">
              {FOOTER.contact.label}
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href="/apply" className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                  Apply to Join
                </a>
              </li>
              <li>
                <a href="/apply/chapter" className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                  Start a Chapter
                </a>
              </li>
              <li>
                <a href="/contact" className="font-body text-foreground-muted hover:text-silver hover:-translate-y-px transition-all duration-150 text-body">
                  Contact
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end sm:justify-between py-8 gap-4">
          <Logo width={160} height={45} className="-ml-6 -mb-2" />
          <p className="font-body text-foreground text-caption tracking-copyright mb-0">
            {FOOTER.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
