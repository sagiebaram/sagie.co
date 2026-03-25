'use client'

import { Section } from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { FAQS } from '@/constants/faq'
import { FAQ_EYEBROW } from '@/constants/copy'

export function FAQ() {
  const ref = useScrollReveal({ y: 24, duration: 0.6 })

  return (
    <Section>
      <Eyebrow>{FAQ_EYEBROW}</Eyebrow>

      <div ref={ref}>
        <FAQAccordion items={FAQS} />
      </div>
    </Section>
  )
}
