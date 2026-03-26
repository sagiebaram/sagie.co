'use client'

import { useState } from 'react'

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className="font-body text-foreground-muted text-label tracking-mid uppercase hover:text-silver hover:-translate-y-px transition-all duration-150"
    >
      {copied ? 'Copied!' : 'Share →'}
    </button>
  )
}
