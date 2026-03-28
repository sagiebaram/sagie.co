'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function BlogIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="44" height="56" rx="3" stroke="#C0C0C0" strokeWidth="1.5" />
      <rect x="16" y="72" width="44" height="56" rx="3" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.4" transform="translate(4, -4)" />
      <line x1="20" y1="24" x2="48" y2="24" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="20" y1="32" x2="48" y2="32" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="20" y1="39" x2="40" y2="39" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="20" y1="46" x2="44" y2="46" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="20" y1="53" x2="36" y2="53" stroke="#C0C0C0" strokeWidth="1" />
      <rect x="20" y="12" width="12" height="8" rx="1" fill="#C0C0C0" fillOpacity="0.2" stroke="#C0C0C0" strokeWidth="1" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BlogError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[BlogError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Stories unavailable"
      message="We couldn't load the latest stories right now."
      illustration={<BlogIllustration />}
      onRetry={reset}
    />
  )
}
