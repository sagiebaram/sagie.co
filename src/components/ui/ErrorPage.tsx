'use client'

import { GridBackground } from '@/components/ui/GridBackground'
import { Button } from '@/components/ui/Button'

interface ErrorPageProps {
  title: string
  message: string
  illustration: React.ReactNode
  onRetry?: () => void
}

export function ErrorPage({ title, message, illustration, onRetry }: ErrorPageProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <GridBackground parallax />
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        <div className="mb-8 opacity-60" aria-hidden="true">
          {illustration}
        </div>
        <h1 className="font-display text-silver text-tier mb-4 tracking-heading uppercase">
          {title}
        </h1>
        <p className="font-body text-foreground-secondary text-body-lg mb-10 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-block font-body uppercase transition-all duration-150 hover:-translate-y-px bg-button-primary-bg [color:var(--color-button-primary-text)] hover:opacity-85 text-button tracking-button px-[34px] py-4"
            >
              Try again
            </button>
          )}
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
