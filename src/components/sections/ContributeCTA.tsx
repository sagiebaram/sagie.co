import { CONTRIBUTE_CTA } from '@/constants/contribute'

/**
 * Gold CTA banner — last section before the form / footer.
 * Matches .planning/mockups/contribute-page.html lines 802–811.
 */
export function ContributeCTA() {
  const { headline, body, ctaPrimary, ctaGhost } = CONTRIBUTE_CTA

  return (
    <section className="relative py-20 px-6 md:px-8" aria-labelledby="cta-title">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="relative overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center px-14 py-16"
          style={{
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.2)',
          }}
        >
          {/* Right-side radial glow — mockup .cta-banner::before */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -right-20 -translate-y-1/2 w-[300px] h-[300px]"
            style={{
              background:
                'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
            }}
          />

          <div className="relative">
            <h2
              id="cta-title"
              className="font-display text-foreground leading-none mb-[10px]"
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                letterSpacing: '0.04em',
              }}
            >
              {headline}
            </h2>
            <p className="text-silver opacity-70 text-[14px] leading-[1.6]">{body}</p>
          </div>

          <div className="relative flex flex-col items-start md:items-end gap-3 shrink-0">
            <a
              href={ctaPrimary.href}
              className="inline-block font-body font-semibold uppercase text-[13px] tracking-[0.08em] px-8 py-[14px] transition-[opacity,transform] duration-200 hover:opacity-[0.88] hover:-translate-y-px"
              style={{
                background: '#C9A84C',
                color: 'rgb(12,12,12)',
              }}
            >
              {ctaPrimary.label}
            </a>
            <a
              href={ctaGhost.href}
              className="inline-block font-body uppercase text-[13px] tracking-[0.08em] px-8 py-[13px] border border-border-default text-silver hover:text-foreground hover:border-silver transition-colors duration-200"
            >
              {ctaGhost.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
