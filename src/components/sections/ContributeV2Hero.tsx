import { GridBackground } from '@/components/ui/GridBackground'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { CONTRIBUTE_V2_HERO } from '@/constants/contribute-v2'

/**
 * /contribute-v2 hero — asymmetric 2-column split.
 *
 * Visually distinct from v1's centered stack: eyebrow + headline live in
 * the left column, the subtitle + a vertical "ECOSYSTEM" decorative label
 * live in the right. On mobile the two columns collapse and the decorative
 * label is hidden.
 */
export function ContributeV2Hero() {
  const { eyebrow, headline, subtitle } = CONTRIBUTE_V2_HERO

  return (
    <section id="v2-hero" className="relative z-1 overflow-hidden">
      <GridBackground parallax />
      <PageHeroAnimation>
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-16 items-end">
            {/* Left column — eyebrow + headline */}
            <div>
              <p className="page-hero-eyebrow font-body uppercase text-foreground-muted mb-5 text-label tracking-eyebrow">
                {eyebrow}
              </p>
              <h1 className="page-hero-line font-display uppercase text-foreground leading-[0.92] tracking-heading text-hero max-w-[760px]">
                {headline}
              </h1>
              <div
                aria-hidden="true"
                className="mt-10 h-px w-24"
                style={{ background: '#C9A84C' }}
              />
            </div>

            {/* Right column — subtitle + vertical decorative label */}
            <div className="relative md:pt-2">
              <p className="page-hero-sub font-body italic text-foreground-muted text-body-lg font-light leading-[1.75] max-w-[320px]">
                {subtitle}
              </p>

              <div
                aria-hidden="true"
                className="hidden md:block absolute top-0 right-0 translate-x-1/2 font-display uppercase text-foreground-dim tracking-[0.4em] text-[11px] leading-none"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg) translateX(50%)',
                  transformOrigin: 'right center',
                }}
              >
                · Ecosystem ·
              </div>
            </div>
          </div>
        </div>
      </PageHeroAnimation>
    </section>
  )
}
