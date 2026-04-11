'use client'

import { useEffect, useRef } from 'react'

interface StepEditModalProps {
  isOpen: boolean
  onClose: () => void
  stepId: string
  stepLabel: string
  children: React.ReactNode
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="combobox"]:not([disabled])',
  '[role="checkbox"]:not([disabled])',
].join(',')

/**
 * Inline edit modal opened from the Review step (ADR-MEMBERSHIP-WIZARD §1 + §7).
 *
 * - role="dialog" + aria-modal="true"
 * - Traps focus inside the modal (Tab / Shift+Tab cycle within).
 * - Escape key closes.
 * - Backdrop click closes.
 * - Stores the opener element on mount and returns focus to it on close.
 */
export function StepEditModal({
  isOpen,
  onClose,
  stepId,
  stepLabel,
  children,
}: StepEditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  // Capture the opener + focus first field + lock scroll when the modal opens
  useEffect(() => {
    if (!isOpen) return

    openerRef.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Defer to next frame so the modal is mounted before we query it
    const rafId = requestAnimationFrame(() => {
      const focusables = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      focusables?.[0]?.focus()
    })

    return () => {
      cancelAnimationFrame(rafId)
      document.body.style.overflow = previousOverflow
      // Return focus to whatever opened the modal (ADR §7)
      openerRef.current?.focus?.()
    }
  }, [isOpen])

  // Escape + focus-trap handling
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const modalEl = modalRef.current
      if (!modalEl) return

      const focusables = Array.from(modalEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((el) => !el.hasAttribute('disabled'))
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (active === first || !modalEl.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const titleId = `step-edit-modal-title-${stepId}`

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={`Edit ${stepLabel}`}
        style={{
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border-default)',
          maxWidth: '560px',
          width: '100%',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2
            id={titleId}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            Edit {stepLabel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              padding: '4px 8px',
            }}
          >
            ×
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  )
}
