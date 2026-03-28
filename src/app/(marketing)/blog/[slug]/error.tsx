'use client'

import { useEffect } from 'react'
import { ErrorPage } from '@/components/ui/ErrorPage'

function ArticleIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="52" height="60" rx="3" stroke="#C0C0C0" strokeWidth="1.5" />
      <rect x="8" y="12" width="52" height="18" rx="3" fill="#C0C0C0" fillOpacity="0.08" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="16" y1="20" x2="44" y2="20" stroke="#C0C0C0" strokeWidth="1.5" />
      <line x1="16" y1="40" x2="52" y2="40" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="16" y1="48" x2="52" y2="48" stroke="#C0C0C0" strokeWidth="1" />
      <line x1="16" y1="56" x2="40" y2="56" stroke="#C0C0C0" strokeWidth="1" />
      <circle cx="64" cy="20" r="10" stroke="#C0C0C0" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="71" y1="27" x2="76" y2="32" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BlogPostError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[BlogPostError]', error)
  }, [error])

  return (
    <ErrorPage
      title="Article unavailable"
      message="This article isn't loading right now."
      illustration={<ArticleIllustration />}
      onRetry={reset}
    />
  )
}
