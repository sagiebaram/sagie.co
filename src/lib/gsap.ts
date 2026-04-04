import type { default as GSAPType } from 'gsap'
import type { default as ScrollTriggerType } from 'gsap/ScrollTrigger'
import type { default as SplitTextType } from 'gsap/SplitText'

let cached: {
  gsap: typeof GSAPType
  ScrollTrigger: typeof ScrollTriggerType
  SplitText: typeof SplitTextType
} | null = null

export async function getGSAP() {
  if (cached) return cached

  const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
  ])

  gsap.registerPlugin(ScrollTrigger, SplitText)

  cached = { gsap, ScrollTrigger, SplitText }
  return cached
}
