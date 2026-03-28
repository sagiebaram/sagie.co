'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function ApplicationIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="48" height="58" rx="3" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="22" y1="26" x2="56" y2="26" stroke="#C0C0C0" strokeWidth="1" />
      <rect x="22" y="30" width="34" height="6" rx="1" stroke="#C0C0C0" strokeWidth="1" />
      <rect x="22" y="42" width="34" height="6" rx="1" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="22" y1="22" x2="38" y2="22" stroke="#C0C0C0" strokeWidth="1.5" />
      <circle cx="57" cy="57" r="12" fill="#111111" stroke="#C0C0C0" strokeWidth="1.5" />
      <path d="M53 57 L56 60 L61 54" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ApplyError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[ApplyError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Form error"
      message="The application form hit a snag. Your data hasn't been lost."
      illustration={<ApplicationIllustration />}
      onRetry={reset}
    />
  )
}
