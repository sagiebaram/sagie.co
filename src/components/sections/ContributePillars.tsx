import {
  CONTRIBUTE_PILLARS_SECTION,
  CONTRIBUTE_PILLARS,
  CONTRIBUTE_PILLAR_HEX,
} from '@/constants/contribute'

/**
 * "Where It Goes" — three pillar cards (ECO / Solutions / Ventures) routing
 * the contribution to its delivery pillar. Matches .planning/mockups/
 * contribute-page.html lines 756–799.
 */
export function ContributePillars() {
  const { eyebrow, titleLines, desc } = CONTRIBUTE_PILLARS_SECTION

  return (
    <section className="relative py-20 px-6 md:px-8" aria-labelledby="pillars-title">
      <div className="relative max-w-[1200px] mx-auto">
        <div className="font-body uppercase text-[10px] tracking-[0.22em] text-foreground-dim mb-3">
          {eyebrow}
        </div>
        <h2
          id="pillars-title"
          className="font-display text-foreground leading-none mb-4"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            letterSpacing: '0.03em',
          }}
        >
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="text-silver opacity-70 max-w-[540px] leading-[1.7] mb-[52px]">{desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {CONTRIBUTE_PILLARS.map((pillar) => {
            const color = CONTRIBUTE_PILLAR_HEX[pillar.id]
            return (
              <div
                key={pillar.id}
                className="relative bg-background-card border border-border-subtle px-9 py-10 overflow-hidden"
                style={{ ['--p-color' as string]: color }}
              >
                {/* Bottom accent line (mockup .pillar-card::after) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-40"
                  style={{ background: color }}
                />

                {/* Glowing indicator dot */}
                <span
                  aria-hidden="true"
                  className="block w-[10px] h-[10px] rounded-full mb-5"
                  style={{
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />

                <div
                  className="font-body uppercase text-[10px] tracking-[0.2em] mb-2"
                  style={{ color }}
                >
                  {pillar.name}
                </div>

                <h3
                  className="font-display text-foreground mb-3"
                  style={{
                    fontSize: '22px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {pillar.title}
                </h3>

                <p className="text-[13px] leading-[1.65] text-silver opacity-65">{pillar.body}</p>

                <div className="flex flex-wrap gap-[6px] mt-5">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body uppercase text-[10px] tracking-[0.1em] px-[10px] py-1 text-foreground-dim"
                      style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '1px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
