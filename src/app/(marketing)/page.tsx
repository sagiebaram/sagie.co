import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { SectionNav, type SectionNavItem } from '@/components/ui/SectionNav'
import { Hero } from '@/components/sections/Hero'
import { Belief } from '@/components/sections/Belief'
import { Pillars } from '@/components/sections/Pillars'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { SocialProof } from '@/components/sections/SocialProof'
import { GlobeShell } from '@/components/GlobeShell'
import { ChapterMap } from '@/components/sections/ChapterMap'
import { getChapters } from '@/lib/chapters'
import { Tiers } from '@/components/sections/Tiers'
import { FounderBridge } from '@/components/sections/FounderBridge'
import { FAQ } from '@/components/sections/FAQ'
import { FinalCTA } from '@/components/sections/FinalCTA'

const SECTIONS: SectionNavItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'belief', label: 'Belief' },
  { id: 'pillars', label: 'Pillars' },
  { id: 'who', label: 'Who' },
  { id: 'proof', label: 'Proof' },
  { id: 'chapters', label: 'Chapters' },
  { id: 'tiers', label: 'Tiers' },
  { id: 'faq', label: 'FAQ' },
  { id: 'founder', label: 'Founder' },
  { id: 'cta', label: 'Join' },
]

export default async function HomePage() {
  const chapters = await getChapters()

  return (
    <main id="main-content" className="relative">
      <CircuitBackground />
      <Navbar />
      <SectionNav items={SECTIONS} />
      <div id="hero"><Hero /></div>
      <div id="belief"><Belief /></div>
      <div id="pillars"><Pillars /></div>
      <div id="who"><WhoItsFor /></div>
      <div id="proof"><SocialProof globe={<GlobeShell />} /></div>
      <div id="chapters"><ChapterMap chapters={chapters} /></div>
      <div id="tiers"><Tiers /></div>
      <div id="faq"><FAQ /></div>
      <div id="founder"><FounderBridge /></div>
      <div id="cta"><FinalCTA /></div>
      <Footer />
    </main>
  )
}
