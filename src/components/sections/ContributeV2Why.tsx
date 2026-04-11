import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CONTRIBUTE_V2_WHY } from '@/constants/contribute-v2'

/**
 * "Why Contribute" manifesto — prose column, no cards.
 *
 * Distinct from v1's info-graphic-heavy grid — here the copy leads the eye
 * down a single column with large readable paragraphs. First paragraph is
 * treated as a pullquote so the opener lands.
 */
export function ContributeV2Why() {
  const { eyebrow, title, paragraphs } = CONTRIBUTE_V2_WHY

  return (
    <Section id="v2-why">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display uppercase text-foreground-secondary text-pillar leading-none tracking-heading mb-10">
        {title}
      </h2>

      <div className="max-w-[680px]">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'font-display uppercase text-foreground tracking-heading text-quote leading-[1.35] mb-10 pl-6 border-l-2 border-[#C9A84C]'
                : 'font-body text-foreground-muted text-body-lg font-light leading-[1.75] mb-6 last:mb-0'
            }
          >
            {p}
          </p>
        ))}
      </div>
    </Section>
  )
}
