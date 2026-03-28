'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function EventsIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="18" width="56" height="52" rx="3" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="10" y1="32" x2="66" y2="32" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="25" y1="10" x2="25" y2="24" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" />
      <line x1="51" y1="10" x2="51" y2="24" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" />
      <rect x="18" y="40" width="10" height="8" rx="1" stroke="#C0C0C0" strokeWidth="1" />
      <rect x="34" y="40" width="10" height="8" rx="1" stroke="#C0C0C0" strokeWidth="1" />
      <rect x="50" y="40" width="10" height="8" rx="1" stroke="#C0C0C0" strokeWidth="1" fillOpacity="0.2" fill="#C0C0C0" />
      <rect x="18" y="54" width="10" height="8" rx="1" stroke="#C0C0C0" strokeWidth="1" />
      <rect x="34" y="54" width="10" height="8" rx="1" stroke="#C0C0C0" strokeWidth="1" fillOpacity="0.2" fill="#C0C0C0" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function EventsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[EventsError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Events unavailable"
      message="We couldn't load upcoming events right now."
      illustration={<EventsIllustration />}
      onRetry={reset}
    />
  )
}
