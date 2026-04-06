'use client'

import Link from 'next/link'

interface PrivacyConsentProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: boolean
}

export function PrivacyConsent({ checked, onChange, error }: PrivacyConsentProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={error ? 'privacy-consent-error' : undefined}
          aria-invalid={error || undefined}
          style={{
            width: '16px',
            height: '16px',
            accentColor: 'var(--silver)',
            marginTop: '1px',
            flexShrink: 0,
          }}
        />
        <span style={{
          fontSize: '11px',
          lineHeight: '1.5',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
        }}>
          I agree to the{' '}
          <Link
            href="/privacy"
            target="_blank"
            style={{ color: 'var(--silver)', textDecoration: 'underline' }}
          >
            Privacy Policy
          </Link>
          {' '}and consent to the processing of my personal data.
        </span>
      </label>
      {error && (
        <span id="privacy-consent-error" style={{ fontSize: '10px', color: 'var(--color-error)' }}>
          You must agree to the privacy policy to continue.
        </span>
      )}
    </div>
  )
}
