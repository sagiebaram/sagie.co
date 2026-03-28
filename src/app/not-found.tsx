import { GridBackground } from '@/components/ui/GridBackground'
import { Button } from '@/components/ui/Button'

function NotFoundIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="28" stroke="#C0C0C0" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="40" cy="40" r="18" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="40" y1="22" x2="40" y2="32" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="48" x2="40" y2="58" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="40" x2="32" y2="40" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="40" x2="58" y2="40" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="40" r="3" fill="#C0C0C0" fillOpacity="0.4" stroke="#C0C0C0" strokeWidth="1" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        <div className="mb-8 opacity-60" aria-hidden="true">
          <NotFoundIllustration />
        </div>
        <h1 className="font-display text-silver text-stat mb-4 tracking-heading">
          404
        </h1>
        <p className="font-body text-foreground-secondary text-body-lg mb-10 leading-relaxed">
          This page doesn&apos;t exist, but there&apos;s plenty to explore.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button variant="outline" href="/">
            Go home
          </Button>
          <Button variant="ghost" href="mailto:contact@sagie.co">
            Contact us
          </Button>
        </div>
      </div>
    </div>
  )
}
