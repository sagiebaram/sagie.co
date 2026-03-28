'use client'

import { useState, useRef, useEffect } from 'react'

const CONTENT_TYPES: { label: string; tag: string }[] = [
  { label: 'Blog', tag: 'notion:blog' },
  { label: 'Events', tag: 'notion:events' },
  { label: 'Resources', tag: 'notion:resources' },
  { label: 'Solutions', tag: 'notion:solutions' },
  { label: 'Members', tag: 'notion:members' },
  { label: 'Chapters', tag: 'notion:chapters' },
]

const ALL_KEY = '__all__'

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error'

// ── Inline SVG icon components ──

function Spinner() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ animation: 'icon-spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M3 8l3.5 3.5L13 5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M4 4l8 8M12 4l-8 8" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ButtonContent({ status, label }: { status: ButtonStatus; label: string }) {
  if (status === 'loading') return <span className="flex items-center justify-center"><Spinner /></span>
  if (status === 'success') return <span className="flex items-center gap-2 justify-center"><CheckIcon />{label}</span>
  if (status === 'error') return <span className="flex items-center gap-2 justify-center"><XIcon />{label}</span>
  return <>{label}</>
}

// ── Button variant class strings (from Button.tsx) ──
const outlineClasses =
  'border border-silver text-silver hover:bg-silver hover:text-background text-button tracking-button px-[34px] py-4 font-body uppercase transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed'
const primaryClasses =
  'bg-white [color:black] hover:opacity-85 text-button tracking-button px-[34px] py-4 font-body uppercase transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed inline-block'

export default function RevalidatePage() {
  const [secret, setSecret] = useState('')
  const [secretEntered, setSecretEntered] = useState(false)
  const [showSecretHint, setShowSecretHint] = useState(false)
  const [statuses, setStatuses] = useState<Map<string, ButtonStatus>>(new Map())
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => clearTimeout(id))
      timersRef.current.clear()
    }
  }, [])

  function setStatus(key: string, status: ButtonStatus) {
    setStatuses((prev) => new Map(prev).set(key, status))
  }

  function getStatus(key: string): ButtonStatus {
    return statuses.get(key) ?? 'idle'
  }

  function scheduleReset(key: string, delay: number, resetFn: () => void) {
    // Clear any existing timer for this key before scheduling a new one
    const existing = timersRef.current.get(key)
    if (existing !== undefined) clearTimeout(existing)
    const id = setTimeout(resetFn, delay)
    timersRef.current.set(key, id)
  }

  function resetToPrompt(wasUnauthorized: boolean) {
    setSecretEntered(false)
    setSecret('')
    setStatuses(new Map())
    if (wasUnauthorized) {
      setShowSecretHint(true)
    }
    // Cancel all pending timers
    timersRef.current.forEach((id) => clearTimeout(id))
    timersRef.current.clear()
  }

  async function handleRevalidate(key: string, tags: string[]) {
    setStatus(key, 'loading')
    const start = Date.now()
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, tags }),
      })
      // Ensure spinner shows for at least 600ms so the user sees it
      const elapsed = Date.now() - start
      if (elapsed < 600) await new Promise((r) => setTimeout(r, 600 - elapsed))
      if (res.status === 401) {
        setStatus(key, 'error')
        scheduleReset(key, 2000, () => resetToPrompt(true))
      } else if (!res.ok) {
        setStatus(key, 'error')
        scheduleReset(key, 3000, () => setStatus(key, 'idle'))
      } else {
        setStatus(key, 'success')
        scheduleReset(key, 3000, () => setStatus(key, 'idle'))
      }
    } catch {
      setStatus(key, 'error')
      scheduleReset(key, 3000, () => setStatus(key, 'idle'))
    }
  }

  if (!secretEntered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-background-card border border-border-default rounded-lg p-8 w-full max-w-sm">
          <h1 className="font-display text-foreground text-subhead tracking-heading mb-6 uppercase">Cache Admin</h1>
          {showSecretHint && (
            <p className="text-amber-400 text-xs mb-3">Secret was invalid or has been rotated. Please re-enter.</p>
          )}
          <label className="block text-foreground-muted font-body text-caption mb-2">Revalidation Secret</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && secret) {
                setShowSecretHint(false)
                setSecretEntered(true)
              }
            }}
            className="w-full bg-background-subtle border border-border-default rounded px-3 py-2 text-foreground font-body text-body mb-4 focus:outline-none focus:border-border-strong"
            placeholder="Enter secret..."
          />
          <button
            onClick={() => {
              setShowSecretHint(false)
              setSecretEntered(true)
            }}
            disabled={!secret}
            className={primaryClasses + ' w-full'}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-foreground text-subhead tracking-heading uppercase">Cache Revalidation</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {CONTENT_TYPES.map(({ label, tag }) => (
            <button
              key={tag}
              onClick={() => handleRevalidate(tag, [tag])}
              disabled={getStatus(tag) === 'loading'}
              className={outlineClasses}
            >
              <ButtonContent status={getStatus(tag)} label={label} />
            </button>
          ))}
        </div>

        <button
          onClick={() => handleRevalidate(ALL_KEY, [])}
          disabled={getStatus(ALL_KEY) === 'loading'}
          className={primaryClasses + ' w-full mb-6'}
        >
          <ButtonContent status={getStatus(ALL_KEY)} label="Refresh All" />
        </button>
      </div>
    </div>
  )
}
