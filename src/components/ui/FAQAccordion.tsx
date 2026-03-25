'use client'

import { useState } from 'react'
import type { FAQItem } from '@/types'

interface FAQAccordionProps {
  items: readonly FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div>
      {items.map((faq, i) => (
        <div key={i} className="border-b border-border-subtle">
          <button
            type="button"
            className="w-full flex items-start justify-between gap-8 py-6 text-left group"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-dm text-ink-11 group-hover:text-ink-12 transition-colors duration-150 text-subhead font-normal">
              {faq.q}
            </span>
            <span className="font-dm text-ink-5 shrink-0 mt-0.5 text-subhead">
              {open === i ? '\u2212' : '+'}
            </span>
          </button>
          {open === i && (
            <div className="pb-6">
              <p className="font-dm text-ink-5 text-body font-light leading-[1.8] max-w-[640px]">
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
