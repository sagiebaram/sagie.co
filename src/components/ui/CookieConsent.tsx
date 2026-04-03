'use client'

import { useSyncExternalStore, useCallback } from 'react'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`))
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

const COOKIE_NAME = 'sagie_cookie_consent'

let cookieSnapshot = getCookie(COOKIE_NAME)
const listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return cookieSnapshot
}

function getServerSnapshot() {
  return 'unknown'
}

function setConsent(value: string) {
  setCookie(COOKIE_NAME, value, 365)
  cookieSnapshot = value
  listeners.forEach((cb) => cb())
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const accept = useCallback(() => setConsent('accepted'), [])
  const manage = useCallback(() => setConsent('necessary'), [])

  if (consent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-100 p-4 md:p-6">
      <div className="mx-auto max-w-[880px] rounded-sm border border-border-subtle bg-background-card p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="font-body text-foreground-secondary text-caption leading-[1.6] flex-1">
          We use essential cookies to keep the site running. No tracking, no ads.
          Read our{' '}
          <a href="/privacy" className="text-silver hover:text-foreground transition-colors underline">
            Privacy Policy
          </a>.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={manage}
            className="font-body uppercase text-foreground-muted hover:text-silver border border-border-default hover:border-silver transition-all duration-150 text-label tracking-button px-4 py-2"
          >
            Manage Preferences
          </button>
          <button
            onClick={accept}
            className="font-body uppercase text-background bg-foreground hover:bg-silver transition-all duration-150 text-label tracking-button px-4 py-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
