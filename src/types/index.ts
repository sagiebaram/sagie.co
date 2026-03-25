export interface Pillar {
  readonly word: string
  readonly subtitle: string
  readonly where: string
  readonly desc: string
}

export interface Persona {
  readonly name: string
  readonly line: string
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

export interface Chapter {
  readonly city: string
  readonly badge: string
  readonly borderColor: string
  readonly textColor: string
}

export interface SocialStat {
  readonly value: string
  readonly label: string
}

export type ButtonVariant = 'primary' | 'ghost' | 'outline'
