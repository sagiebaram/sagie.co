export interface Pillar {
  readonly word: string
  readonly subtitle: string
  readonly where: string
  readonly desc: string
}

export interface Persona {
  readonly name: string
  readonly line: string
  readonly expanded: string
  readonly frontLabel: string
  readonly backLabel: string
}

export interface Tier {
  readonly name: string
  readonly tag: string
  readonly desc: string
  readonly cta: string
  readonly ctaActive: boolean
}

export interface FAQItem {
  readonly q: string
  readonly a: string
}

export type ChapterStatus = 'live' | 'soon' | 'open'

export interface Chapter {
  readonly city: string
  readonly detail: string
  readonly status: ChapterStatus
  readonly badge: string
  readonly action: { readonly label: string; readonly href: string }
}

export interface SocialStat {
  readonly value: string
  readonly label: string
}

export type ButtonVariant = 'primary' | 'ghost' | 'outline'
