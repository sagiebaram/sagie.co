import type { Metadata } from 'next'
import { CircuitBackground } from '@/components/ui/CircuitBackground'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Coming Soon — SAGIE',
}

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <CircuitBackground />
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        <h1 className="font-display uppercase text-silver text-stat mb-4 tracking-heading">
          COMING SOON
        </h1>
        <p className="font-body text-foreground-secondary text-body-lg mb-10 leading-relaxed">
          We&apos;re building something worth the wait.
        </p>
        <Button variant="outline" href="/">
          Back to Home &rarr;
        </Button>
      </div>
    </div>
  )
}
