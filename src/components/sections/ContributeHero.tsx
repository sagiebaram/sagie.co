import { GridBackground } from '@/components/ui/GridBackground'
import { PageHeroAnimation } from '@/components/ui/PageHeroAnimation'
import { SplitTextReveal } from '@/components/ui/SplitTextReveal'
import { Button } from '@/components/ui/Button'
import { CONTRIBUTE_HERO } from '@/constants/contribute'

/**
 * Hero for /contribute (revised 04-11).
 *
 * Matches the wrapper + eyebrow + SplitTextReveal pattern used on the
 * three pillar pages (`src/app/(marketing)/{eco,solutions,ventures}/page.tsx`).
 * Copy stays the same as v1 ("BUILD / WITH / US" from mockups/contribute-page.html)
 * — only the layout primitives change, so the hero reads as part of the site
 * system rather than a bespoke one-off.
 */
export function ContributeHero() {
  const { label, subtitle, ctaPrimary, ctaGhost } = CONTRIBUTE_HERO

  return (
    <section id="contribute-hero" className="relative z-1 overflow-hidden">
      <GridBackground parallax />
      <PageHeroAnimation>
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="page-hero-eyebrow font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            {label}
          </p>
          <SplitTextReveal
            as="h1"
            className="font-display uppercase text-hero leading-[0.9] mb-8"
            lines={[
              { text: 'BUILD', className: 'text-foreground-dim' },
              { text: 'WITH', className: 'text-foreground-secondary' },
              { text: 'US.', className: 'text-foreground' },
            ]}
          />
          <p className="page-hero-sub font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[480px] mb-10">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-start gap-3">
            <Button variant="primary" href={ctaPrimary.href}>
              {ctaPrimary.label} →
            </Button>
            <Button variant="ghost" href={ctaGhost.href}>
              {ctaGhost.label}
            </Button>
          </div>
        </div>
      </PageHeroAnimation>
    </section>
  )
}
