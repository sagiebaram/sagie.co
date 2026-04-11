import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import {
  CONTRIBUTE_V2_CATEGORIES_SECTION,
  CONTRIBUTE_V2_CATEGORIES,
  type ContributeV2Category,
} from '@/constants/contribute-v2'

/**
 * Five contribution categories, rendered as a tall vertical numbered list.
 *
 * Visually distinct from v1's 3×2 card grid — here each row is a wide
 * horizontal band (number | name | body) so the page reads top-to-bottom
 * like a manifesto rather than left-to-right like a product catalog.
 */
export function ContributeV2Categories() {
  const { eyebrow, title, desc } = CONTRIBUTE_V2_CATEGORIES_SECTION

  return (
    <Section id="v2-categories">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display uppercase text-foreground-secondary text-pillar leading-none tracking-heading mb-4">
        {title}
      </h2>
      <p className="font-body text-foreground-muted text-body font-light leading-[1.75] max-w-[560px] mb-16">
        {desc}
      </p>

      <ScrollReveal selector=".v2-cat-row" stagger={0.08} y={18} duration={0.55}>
        <ol className="flex flex-col">
          {CONTRIBUTE_V2_CATEGORIES.map((cat, i) => (
            <V2CategoryRow key={cat.id} cat={cat} isLast={i === CONTRIBUTE_V2_CATEGORIES.length - 1} />
          ))}
        </ol>
      </ScrollReveal>
    </Section>
  )
}

function V2CategoryRow({ cat, isLast }: { cat: ContributeV2Category; isLast: boolean }) {
  return (
    <li
      className={`v2-cat-row grid grid-cols-[auto_1fr] md:grid-cols-[96px_220px_1fr] gap-x-6 md:gap-x-10 gap-y-3 py-10 md:py-12 ${
        isLast ? '' : 'border-b border-border-subtle'
      }`}
    >
      {/* Gold tracked number */}
      <span
        aria-hidden="true"
        className="font-display text-[clamp(44px,6vw,72px)] leading-none tracking-heading row-span-2 md:row-span-1"
        style={{ color: '#C9A84C' }}
      >
        {cat.num}
      </span>

      {/* Category name — large display */}
      <h3 className="font-display uppercase text-foreground-secondary text-tier leading-none tracking-heading col-start-2 md:col-start-2">
        {cat.name}
      </h3>

      {/* Body — flows to full width on desktop, below name on mobile */}
      <p className="font-body text-foreground-muted text-body font-light leading-[1.8] col-start-2 md:col-start-3 md:row-start-1 max-w-[560px]">
        {cat.body}
      </p>
    </li>
  )
}
