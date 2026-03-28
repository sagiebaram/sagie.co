'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function SuggestEventIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="18" width="56" height="44" rx="3" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="10" y1="30" x2="66" y2="30" stroke="#C0C0C0" strokeWidth="1.5" />
      <path d="M40 18 L40 8" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="6" r="3" fill="#C0C0C0" fillOpacity="0.3" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="20" y1="42" x2="56" y2="42" stroke="#C0C0C0" strokeWidth="1" />
      <rect x="20" y="48" width="36" height="6" rx="1" stroke="#C0C0C0" strokeWidth="1" />
      <circle cx="23" cy="24" r="3" fill="#C0C0C0" fillOpacity="0.3" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SuggestEventError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[SuggestEventError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Submission error"
      message="The event suggestion form hit a snag."
      illustration={<SuggestEventIllustration />}
      onRetry={reset}
    />
  )
}
