'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function ResourcesIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="24" width="30" height="38" rx="2" stroke="#C0C0C0" strokeWidth="1.5" />
      <rect x="44" y="16" width="24" height="18" rx="2" stroke="#C0C0C0" strokeWidth="1.5" />
      <rect x="44" y="40" width="24" height="22" rx="2" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="14" y1="34" x2="32" y2="34" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="14" y1="41" x2="32" y2="41" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="14" y1="48" x2="28" y2="48" stroke="#C0C0C0" strokeWidth="1" />
      <circle cx="20" cy="28" r="3" fill="#C0C0C0" fillOpacity="0.3" stroke="#C0C0C0" strokeWidth="1" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ResourcesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[ResourcesError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Resources unavailable"
      message="Resources aren't loading right now."
      illustration={<ResourcesIllustration />}
      onRetry={reset}
    />
  )
}
