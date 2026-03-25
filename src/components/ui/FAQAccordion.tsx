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
        <div key={i} className={`border-b border-border-default ${i === items.length - 1 ? 'pb-4' : ''}`}>
          <button
            type="button"
            className="w-full flex items-start justify-between gap-8 py-6 text-left group"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-body text-foreground-secondary group-hover:text-foreground transition-colors duration-150 text-subhead font-normal">
              {faq.q}
            </span>
            <span className="font-body text-foreground-dim shrink-0 mt-0.5 text-subhead">
              {open === i ? '\u2212' : '+'}
            </span>
          </button>
          {open === i && (
            <div className="pb-6">
              <p className="font-body text-foreground-muted text-body font-light leading-[1.8] max-w-[640px]">
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
