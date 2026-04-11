import { Button } from '@/components/ui/Button'
import { CONTRIBUTE_V2_CLOSING } from '@/constants/contribute-v2'

/**
 * /contribute-v2 closing CTA — full-bleed dark band with a single oversized
 * button. Visually distinct from v1's inline gold banner with two CTAs:
 * here the treatment is quieter and taller, and there is only one action.
 */
export function ContributeV2ClosingCTA() {
  const { eyebrow, title, body, cta } = CONTRIBUTE_V2_CLOSING

  return (
    <section
      id="v2-closing"
      className="relative z-1 overflow-hidden border-t border-border-strong"
      style={{ background: 'var(--bg-subtle)' }}
    >
      {/* Subtle gold glow in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 65%)',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 md:px-8 py-24 md:py-36 text-center">
        <p className="font-body uppercase text-foreground-muted text-label tracking-eyebrow mb-6">
          {eyebrow}
        </p>
        <h2 className="font-display uppercase text-foreground text-hero leading-[0.95] tracking-heading mb-8 max-w-[920px] mx-auto">
          {title}
        </h2>
        <p className="font-body text-foreground-muted text-body-lg font-light leading-[1.75] max-w-[620px] mx-auto mb-12">
          {body}
        </p>
        <Button variant="primary" href={cta.href} className="text-[17px] px-10 py-5">
          {cta.label}
        </Button>
      </div>
    </section>
  )
}
