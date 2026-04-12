'use client'
'use no memo' // react-hook-form's useFormContext().watch() is not compiler-safe

import { useState, useRef, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import type { MembershipFormData } from '@/components/forms/MembershipWizard'
import { referralSourceOptions } from '@/lib/schemas'
import { PrivacyConsent } from '@/components/ui/PrivacyConsent'

interface StepReviewProps {
  privacyConsent: boolean
  onPrivacyChange: (checked: boolean) => void
  privacyError: boolean
}

const SECTION_HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  padding: '10px 0',
  borderBottom: '0.5px solid var(--border-default)',
  userSelect: 'none',
}

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-body)',
  margin: 0,
}

const CHEVRON_STYLE: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--text-dim)',
  transition: 'transform 0.15s',
  flexShrink: 0,
}

const FIELD_LABEL_STYLE: React.CSSProperties = {
  fontSize: '9px',
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'var(--text-dim)',
  fontFamily: 'var(--font-body)',
}

const FIELD_VALUE_STYLE: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-body)',
  lineHeight: '1.5',
}

const EDIT_ICON_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-dim)',
  cursor: 'pointer',
  padding: '0 4px',
  fontSize: '10px',
  lineHeight: 1,
  flexShrink: 0,
  opacity: 0.5,
  transition: 'opacity 0.15s',
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-card)',
  border: '0.5px solid var(--silver)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  padding: '6px 8px',
  outline: 'none',
}

// --- Inline editable field ---

function EditableField({
  label,
  value,
  fieldName,
  type = 'text',
  options,
}: {
  label: string
  value: string | undefined
  fieldName: keyof MembershipFormData
  type?: 'text' | 'textarea' | 'select'
  options?: readonly string[]
}) {
  const { setValue, trigger } = useFormContext<MembershipFormData>()
  const [editing, setEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value ?? '')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  // Focus the input when entering edit mode
  useEffect(() => {
    if (editing) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [editing])

  if (!value && !editing) return null

  const save = async () => {
    setValue(fieldName, localValue as never, { shouldDirty: true })
    const valid = await trigger(fieldName)
    if (!valid) {
      setError('Invalid value')
    } else {
      setError(null)
      setEditing(false)
    }
  }

  const cancel = () => {
    setLocalValue(value ?? '')
    setError(null)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') { e.preventDefault(); void save() }
    if (e.key === 'Escape') cancel()
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 0' }}>
        <span style={FIELD_LABEL_STYLE}>{label}</span>
        {type === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => void save()}
            onKeyDown={(e) => { if (e.key === 'Escape') cancel() }}
            rows={3}
            style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: '1.5' }}
          />
        ) : type === 'select' && options ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={localValue}
            onChange={(e) => {
              const v = e.target.value
              setLocalValue(v)
              setValue(fieldName, v as never, { shouldDirty: true })
              void trigger(fieldName).then((valid) => {
                if (valid) setEditing(false)
              })
            }}
            onBlur={() => void save()}
            onKeyDown={handleKeyDown}
            style={INPUT_STYLE}
          >
            <option value="">Select...</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => void save()}
            onKeyDown={handleKeyDown}
            style={INPUT_STYLE}
          />
        )}
        {error && (
          <span style={{ fontSize: '10px', color: 'var(--color-error)', fontFamily: 'var(--font-body)' }}>{error}</span>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={FIELD_LABEL_STYLE}>{label}</span>
        <button
          type="button"
          onClick={() => { setLocalValue(value ?? ''); setError(null); setEditing(true) }}
          aria-label={`Edit ${label}`}
          style={EDIT_ICON_STYLE}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5' }}
        >
          ✎
        </button>
      </div>
      <div style={FIELD_VALUE_STYLE}>{value}</div>
    </div>
  )
}

function ReviewTags({ label, tags }: { label: string; tags: readonly string[] }) {
  if (tags.length === 0) return null
  return (
    <div style={{ padding: '4px 0' }}>
      <span style={FIELD_LABEL_STYLE}>{label}</span>
      <div style={FIELD_VALUE_STYLE}>{tags.join(', ')}</div>
    </div>
  )
}

// --- Collapsible section (no preview snippet) ---

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o) } }}
        style={SECTION_HEADER_STYLE}
        aria-expanded={open}
      >
        <h3 style={SECTION_TITLE_STYLE}>{title}</h3>
        <span style={{ ...CHEVRON_STYLE, transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: '4px 0 8px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export function StepReview({ privacyConsent, onPrivacyChange, privacyError }: StepReviewProps) {
  const { watch, setValue } = useFormContext<MembershipFormData>()
  const data = watch()

  const newsletterConsent = data.newsletterConsent ?? false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <Section title="About">
        <EditableField label="Name" value={data.fullName} fieldName="fullName" />
        <EditableField label="Email" value={data.email} fieldName="email" />
        <EditableField label="Phone" value={data.phone} fieldName="phone" />
        <EditableField label="LinkedIn" value={data.linkedIn} fieldName="linkedIn" />
      </Section>

      <Section title="Location">
        <EditableField label="Country" value={data.country} fieldName="country" />
        <EditableField label="State" value={data.state} fieldName="state" />
        <EditableField label="City" value={data.city} fieldName="city" />
      </Section>

      <Section title="Identity">
        <ReviewTags label="Work Style" tags={data.workStyle ?? []} />
        <EditableField label="Company" value={data.companyName} fieldName="companyName" />
        <EditableField label="Organization" value={data.organizationName} fieldName="organizationName" />
        <EditableField label="Freelancer" value={data.freelancerDescription} fieldName="freelancerDescription" />
      </Section>

      <Section title="Role">
        <ReviewTags label="I am a..." tags={data.identityTags ?? []} />
        <ReviewTags label="Looking for..." tags={data.needTags ?? []} />
        <EditableField label="Services offered" value={data.serviceProviderDetail} fieldName="serviceProviderDetail" type="textarea" />
      </Section>

      <Section title="More">
        <EditableField label="Building / working on" value={data.whatTheyNeed} fieldName="whatTheyNeed" type="textarea" />
        <EditableField label="Looking for in community" value={data.communityExpectation} fieldName="communityExpectation" type="textarea" />
        <EditableField label="Community means" value={data.communityMeaning} fieldName="communityMeaning" type="textarea" />
        <EditableField label="Why SAGIE" value={data.howTheyKnowSagie} fieldName="howTheyKnowSagie" type="textarea" />
        <EditableField label="Heard about us" value={data.referralSource} fieldName="referralSource" type="select" options={referralSourceOptions} />
        <EditableField label="Referred by" value={data.referralName} fieldName="referralName" />
      </Section>

      {/* Consent — always visible */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PrivacyConsent
          checked={privacyConsent}
          onChange={onPrivacyChange}
          error={privacyError}
        />

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={newsletterConsent}
            onChange={(e) => setValue('newsletterConsent', e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              accentColor: 'var(--silver)',
              marginTop: '1px',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              lineHeight: '1.5',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Subscribe to The SAGIE Letter — weekly insights on ecosystem building, startups, and community.
          </span>
        </label>
      </div>
    </div>
  )
}
