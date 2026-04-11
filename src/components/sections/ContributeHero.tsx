import { CONTRIBUTE_HERO } from '@/constants/contribute'

/**
 * Hero section for /contribute. Matches .planning/mockups/contribute-page.html
 * lines 621–632 verbatim:
 *   - Gold outlined eyebrow label
 *   - "BUILD / WITH / US" display headline (Bebas Neue), "US" with gold stroke emphasis
 *   - Subtitle
 *   - Two CTAs (gold primary → #ways, ghost → /apply)
 */
export function ContributeHero() {
  const { label, headlineLines, emphasisIndex, subtitle, ctaPrimary, ctaGhost } = CONTRIBUTE_HERO

  return (
    <section
      className="relative overflow-hidden pt-[160px] pb-[100px] px-6 md:px-8"
      aria-labelledby="contribute-hero-title"
    >
      {/* Ambient gold radial glow behind the headline — mockup .hero::before */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 w-[700px] h-[400px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto">
        <span
          className="inline-block font-body uppercase text-[11px] tracking-[0.2em] px-[14px] py-[5px] mb-6"
          style={{
            color: '#C9A84C',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '2px',
          }}
        >
          {label}
        </span>

        <h1
          id="contribute-hero-title"
          className="font-display uppercase text-foreground mb-7 leading-[0.92]"
          style={{
            fontSize: 'clamp(64px, 9vw, 120px)',
            letterSpacing: '0.02em',
          }}
        >
          {headlineLines.map((line, i) =>
            i === emphasisIndex ? (
              <em
                key={line}
                className="block not-italic"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px #C9A84C',
                }}
              >
                {line}
              </em>
            ) : (
              <span key={line} className="block">
                {line}
              </span>
            )
          )}
        </h1>

        <p className="max-w-[560px] font-body text-silver text-[16px] leading-[1.7] opacity-85 mb-12">
          {subtitle}
        </p>

        <div className="flex flex-wrap gap-4">
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
    </section>
  )
}
