'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function GeneralIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="60" rx="4" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="10" y1="30" x2="70" y2="30" stroke="#C0C0C0" strokeWidth="1.5" />
      <circle cx="22" cy="20" r="3" fill="#C0C0C0" />
      <circle cx="33" cy="20" r="3" fill="#C0C0C0" />
      <line x1="25" y1="50" x2="55" y2="50" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="25" y1="58" x2="45" y2="58" stroke="#C0C0C0" strokeWidth="1.5" />
      <path d="M40 36 L46 42 L40 48 L34 42 Z" stroke="#C0C0C0" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[RootError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Something went wrong"
      message="Something unexpected happened. We're on it."
      illustration={<GeneralIllustration />}
      onRetry={reset}
    />
  )
}
