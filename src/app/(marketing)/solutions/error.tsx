'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function SolutionsIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="30" r="14" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="40" y1="44" x2="40" y2="56" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="30" y1="56" x2="50" y2="56" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="62" x2="47" y2="62" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 28 L38 32 L46 24" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SolutionsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[SolutionsError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Solutions unavailable"
      message="Solutions aren't loading right now."
      illustration={<SolutionsIllustration />}
      onRetry={reset}
    />
  )
}
