import {
  CONTRIBUTE_WAYS_SECTION,
  CONTRIBUTE_CARDS,
  CONTRIBUTE_ACCENT_HEX,
  type ContributeCard,
} from '@/constants/contribute'

/**
 * "Ways to Contribute" section — 6 cards in two 3-card rows.
 * Matches .planning/mockups/contribute-page.html lines 645–719.
 *
 * Tint colors driven by the accent token on each card (see constants):
 *   Time + Skills  = gold     (#C9A84C)
 *   Capital + Space = ECO     (#7A9E7E)
 *   Network         = Solutions (#6B9EC0)   — mockup blue, not theme blue
 *   Sponsorship     = Ventures  (#8A8A8A)   — mockup gray, not theme gray
 */
export function ContributeGrid() {
  const { eyebrow, titleLines, desc } = CONTRIBUTE_WAYS_SECTION
  const topRow = CONTRIBUTE_CARDS.slice(0, 3)
  const bottomRow = CONTRIBUTE_CARDS.slice(3, 6)

  return (
    <section id="ways" className="relative py-20 px-6 md:px-8" aria-labelledby="ways-title">
      <div className="relative max-w-[1200px] mx-auto">
        <div className="font-body uppercase text-[10px] tracking-[0.22em] text-foreground-dim mb-3">
          {eyebrow}
        </div>
        <h2
          id="ways-title"
          className="font-display text-foreground leading-none mb-4"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            letterSpacing: '0.03em',
          }}
        >
          {titleLines.map((line, i) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          {/* Render fallback from array length for accessibility — not used for text */}
          <span className="sr-only">{desc}</span>
        </h2>
        <p className="text-silver opacity-70 max-w-[540px] leading-[1.7] mb-[52px]">{desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mb-[2px]">
          {topRow.map((card) => (
            <ContributeCardTile key={card.id} card={card} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
          {bottomRow.map((card) => (
            <ContributeCardTile key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ContributeCardTile({ card }: { card: ContributeCard }) {
  const accent = CONTRIBUTE_ACCENT_HEX[card.accent]

  return (
    <a
      href="#form"
      className="contrib-card group relative block border border-border-subtle bg-background-card px-9 py-10 overflow-hidden transition-[background,border-color] duration-300 hover:border-border-default"
      style={{
        // Expose accent to CSS so child elements and the ::before rail can read it.
        ['--accent' as string]: accent,
      }}
      aria-label={`${card.tag} — ${card.title}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: accent }}
      />

      <div
        className="w-[42px] h-[42px] flex items-center justify-center mb-6"
        style={{ border: `1px solid ${accent}`, color: accent }}
        aria-hidden="true"
      >
        <CardIcon id={card.id} />
      </div>

      <span
        className="block font-body uppercase text-[10px] tracking-[0.18em] mb-2"
        style={{ color: accent }}
      >
        {card.tag}
      </span>

      <h3
        className="font-display text-foreground mb-3 leading-none"
        style={{
          fontSize: '26px',
          letterSpacing: '0.04em',
        }}
      >
        {card.title}
      </h3>

      <p className="text-[13px] leading-[1.65] text-silver opacity-75 mb-7">{card.body}</p>

      <span
        className="font-body uppercase text-[11px] tracking-[0.12em] inline-flex items-center gap-2"
        style={{ color: accent }}
      >
        {card.link}
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </span>
    </a>
  )
}

/** Icon sprites — copied from the mockup one-for-one so visual parity holds. */
function CardIcon({ id }: { id: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
  }
  switch (id) {
    case 'time':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      )
    case 'capital':
      return (
        <svg {...common}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    case 'network':
      return (
        <svg {...common}>
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="m8 12 8-5M8 12l8 5" />
        </svg>
      )
    case 'skills':
      return (
        <svg {...common}>
          <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1 1 .03 2.798-1.5 2.798H4.298c-1.528 0-2.498-1.798-1.5-2.798L4.2 15.3" />
        </svg>
      )
    case 'sponsorship':
      return (
        <svg {...common}>
          <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      )
    case 'space':
      return (
        <svg {...common}>
          <path d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
        </svg>
      )
    default:
      return null
  }
}
