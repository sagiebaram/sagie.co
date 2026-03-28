import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { GridBackground } from '@/components/ui/GridBackground'
import { ChapterForm } from '@/components/forms/ChapterForm'

export default function ApplyChapterPage() {
  return (
    <main className="relative">
      <CircuitBackground />
      <Navbar />

      <section className="relative z-[1] overflow-hidden">
        <GridBackground />
        <div className="relative z-10 max-w-[880px] mx-auto px-6 md:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
          <p className="font-body uppercase text-foreground-muted mb-4 text-label tracking-eyebrow">
            Lead a Chapter
          </p>
          <h1 className="font-display uppercase text-hero leading-[0.9] mb-8">
            <span className="block text-foreground-dim">BRING SAGIE</span>
            <span className="block text-foreground-secondary">TO YOUR CITY.</span>
          </h1>
          <p className="font-body italic text-foreground-muted text-body-lg font-light leading-[1.7] max-w-[380px] mb-12">
            Chapter Leads are selected, not self-appointed. If the timing and alignment are right, the conversation will happen.
          </p>
          <ChapterForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
