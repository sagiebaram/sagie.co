import { GridBackground } from '@/components/ui/GridBackground'
import { Button } from '@/components/ui/Button'

function CircuitBrokenIllustration() {
  return (
    <>
      <style>{`
        .broken-node {
          animation: pulse-node 2.5s ease-in-out infinite;
        }
      `}</style>
      <svg
        width="120"
        height="100"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Circuit board with disconnected node"
      >
        {/* Horizontal trace — left section */}
        <line x1="10" y1="50" x2="38" y2="50" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Junction node — left */}
        <circle cx="10" cy="50" r="3" fill="#C0C0C0" fillOpacity="0.35" stroke="#C0C0C0" strokeWidth="1" strokeOpacity="0.5" />

        {/* Vertical trace — top-left branch */}
        <line x1="38" y1="50" x2="38" y2="20" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        {/* Horizontal trace — top */}
        <line x1="38" y1="20" x2="70" y2="20" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        {/* Junction node — top */}
        <circle cx="70" cy="20" r="3" fill="#C0C0C0" fillOpacity="0.35" stroke="#C0C0C0" strokeWidth="1" strokeOpacity="0.5" />
        {/* Vertical trace — top to mid */}
        <line x1="70" y1="20" x2="70" y2="38" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />

        {/* Center junction node */}
        <circle cx="38" cy="50" r="3.5" fill="#C0C0C0" fillOpacity="0.4" stroke="#C0C0C0" strokeWidth="1" strokeOpacity="0.55" />

        {/* Horizontal trace — center to right, up to the break */}
        <line x1="38" y1="50" x2="68" y2="50" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />

        {/* BREAK: dashed gap segment before disconnected node */}
        <line x1="70" y1="50" x2="88" y2="50" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="3 4" strokeLinecap="round" />

        {/* Vertical trace — bottom-left branch */}
        <line x1="38" y1="50" x2="38" y2="78" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        {/* Horizontal trace — bottom */}
        <line x1="38" y1="78" x2="70" y2="78" stroke="#C0C0C0" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        {/* Junction node — bottom */}
        <circle cx="70" cy="78" r="3" fill="#C0C0C0" fillOpacity="0.3" stroke="#C0C0C0" strokeWidth="1" strokeOpacity="0.45" />

        {/* Disconnected broken node — destination never reached */}
        <circle
          cx="100"
          cy="50"
          r="9"
          fill="none"
          stroke="#C0C0C0"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeDasharray="4 3"
          className="broken-node"
        />
        <circle cx="100" cy="50" r="3.5" fill="#C0C0C0" fillOpacity="0.25" className="broken-node" />
      </svg>
    </>
  )
}

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <GridBackground />
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        <div className="mb-8 opacity-60" aria-hidden="true">
          <CircuitBrokenIllustration />
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
