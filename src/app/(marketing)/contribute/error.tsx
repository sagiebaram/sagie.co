'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function ContributeIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circuit node graph — visual echo of the "ecosystem" concept */}
      <circle cx="16" cy="20" r="4" stroke="#C0C0C0" strokeWidth="1.5" />
      <circle cx="64" cy="20" r="4" stroke="#C0C0C0" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="5" stroke="#C0C0C0" strokeWidth="1.5" />
      <circle cx="16" cy="60" r="4" stroke="#C0C0C0" strokeWidth="1.5" />
      <circle cx="64" cy="60" r="4" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="20" y1="22" x2="36" y2="38" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="60" y1="22" x2="44" y2="38" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="20" y1="58" x2="36" y2="42" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="60" y1="58" x2="44" y2="42" stroke="#C0C0C0" strokeWidth="1" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ContributeError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[ContributeError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Contribute page error"
      message="The contribute page hit a snag. Your progress, if any, hasn't been lost."
      illustration={<ContributeIllustration />}
      onRetry={reset}
    />
  )
}
