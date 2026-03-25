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
      className="font-body text-silver text-label tracking-label uppercase hover:text-foreground transition-colors duration-150"
    >
      {copied ? 'Copied!' : 'Share →'}
    </button>
  )
}
