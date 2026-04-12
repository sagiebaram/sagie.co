'use client'

import { useFormContext } from 'react-hook-form'

import type { MembershipFormData } from '@/components/forms/MembershipWizard'
import { identityTagOptions, needTagOptions } from '@/lib/schemas'
import { FormField } from '@/components/ui/FormField'

// ADR §2 Step 4 — helper text per identity tag (UI only, not stored)
const IDENTITY_HELPERS: Record<string, string> = {
  'Founder': 'Building a startup',
  'Investor': 'Angel, VC, LP',
  'Service Provider': 'Consultants, agencies, freelance services',
  'Job Seeker': 'Looking for a role',
  'Corporate Executive': 'Works at an established company',
  'Ecosystem Builder': 'Community leaders, accelerator operators, gov/econ dev',
  'Advisor / Mentor': 'Experienced, wants to give back',
  'Student / Early Career': 'Learning, exploring',
}

// ADR §2 Step 4 — helper text per need tag (UI only, not stored)
const NEED_HELPERS: Record<string, string> = {
  'Co-founder': 'Looking for a partner to build with',
  'Funding': 'Seeking investment',
  'Deal flow': 'Looking for startups to invest in',
  'Talent / Hiring': 'Building a team',
  'Clients / Customers': 'Looking for business',
  'Mentorship': 'Wants guidance',
  'Service providers': 'Needs specific help — legal, design, etc.',
  'Community / Network': 'Connect with like-minded people',
  'Partnership opportunities': 'Strategic alliances, distribution',
  'A job': 'Actively seeking employment',
}

interface TagCheckboxGroupProps {
  label: string
  name: string
  options: readonly string[]
  helpers: Record<string, string>
  value: string[]
  onChange: (value: string[]) => void
  error?: string | undefined
}

function TagCheckboxGroup({ label, name, options, helpers, value, onChange, error }: TagCheckboxGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        id={`${name}-label`}
        style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
        <span style={{ color: 'var(--silver)', marginLeft: '4px' }}>*</span>
      </label>
      <div
        id={name}
        role="group"
        aria-labelledby={`${name}-label`}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
      >
        {options.map((opt) => {
          const isChecked = value.includes(opt)
          const toggle = () => {
            const next = isChecked
              ? value.filter((v) => v !== opt)
              : [...value, opt]
            onChange(next)
          }
          return (
            <div
              key={opt}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onClick={toggle}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  toggle()
                }
              }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', cursor: 'pointer', minWidth: '180px' }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: `0.5px solid ${isChecked ? 'var(--silver)' : 'var(--border-default)'}`,
                  background: isChecked ? 'var(--silver)' : 'var(--bg-card)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s, border-color 0.15s',
                  marginTop: '2px',
                }}
              >
                {isChecked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="var(--bg-card)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    userSelect: 'none',
                  }}
                >
                  {opt}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-body)',
                    userSelect: 'none',
                    marginTop: '1px',
                  }}
                >
                  {helpers[opt]}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      {error && (
        <span id={`${name}-error`} style={{ fontSize: '10px', color: 'var(--color-error)' }}>{error}</span>
      )}
    </div>
  )
}

export function StepRoleAndNeeds() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<MembershipFormData>()

  const identityTags = watch('identityTags') ?? []
  const needTags = watch('needTags') ?? []
  const showServiceProviderField = identityTags.includes('Service Provider')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <TagCheckboxGroup
        label="I am a..."
        name="identityTags"
        options={identityTagOptions}
        helpers={IDENTITY_HELPERS}
        value={identityTags}
        onChange={(v) => setValue('identityTags', v as MembershipFormData['identityTags'], { shouldValidate: true })}
        error={errors.identityTags?.message}
      />

      {showServiceProviderField && (
        <div aria-live="polite">
          <FormField
            label="What do you offer?"
            name="serviceProviderDetail"
            type="textarea"
            placeholder="Describe your services"
            registration={register('serviceProviderDetail')}
            error={errors.serviceProviderDetail?.message}
          />
        </div>
      )}

      <TagCheckboxGroup
        label="I'm looking for..."
        name="needTags"
        options={needTagOptions}
        helpers={NEED_HELPERS}
        value={needTags}
        onChange={(v) => setValue('needTags', v as MembershipFormData['needTags'], { shouldValidate: true })}
        error={errors.needTags?.message}
      />
    </div>
  )
}
