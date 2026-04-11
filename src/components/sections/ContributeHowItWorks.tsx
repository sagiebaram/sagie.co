import { CONTRIBUTE_HOW_SECTION, CONTRIBUTE_STEPS } from '@/constants/contribute'

/**
 * "How It Works" — 4 step cards in a single row on desktop, 2×2 on tablet,
 * stacked on mobile. Matches .planning/mockups/contribute-page.html lines
 * 724–751 (including the step-num gold overlay and connector dot between
 * adjacent cards).
 */
export function ContributeHowItWorks() {
  const { eyebrow, title, desc } = CONTRIBUTE_HOW_SECTION

  return (
    <section className="relative py-20 px-6 md:px-8" aria-labelledby="how-title">
      <div className="relative max-w-[1200px] mx-auto">
        <div className="font-body uppercase text-[10px] tracking-[0.22em] text-foreground-dim mb-3">
          {eyebrow}
        </div>
        <h2
          id="how-title"
          className="font-display text-foreground leading-none mb-4"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            letterSpacing: '0.03em',
          }}
        >
          {title}
        </h2>
        <p className="text-silver opacity-70 max-w-[540px] leading-[1.7] mb-[52px]">{desc}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
          {CONTRIBUTE_STEPS.map((step, i) => (
            <div
              key={step.num}
              className="step relative bg-background-card border border-border-subtle px-7 py-9 md:border-r-0 md:last:border-r"
            >
              <span
                aria-hidden="true"
                className="block font-display leading-none mb-3"
                style={{
                  fontSize: '64px',
                  color: 'rgba(201,168,76,0.12)',
                }}
              >
                {step.num}
              </span>
              <h3
                className="font-display text-foreground mb-2"
                style={{
                  fontSize: '20px',
                  letterSpacing: '0.04em',
                }}
              >
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.6] text-silver opacity-65">{step.body}</p>

              {/* Connector dot between cards (mockup .step::after) — desktop only */}
              {i < CONTRIBUTE_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden md:block absolute top-9 -right-[5px] w-2 h-2 rounded-full z-[2]"
                  style={{
                    background: '#C9A84C',
                    border: '1px solid var(--bg)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
