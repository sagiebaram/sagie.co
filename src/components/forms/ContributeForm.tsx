'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ContributeSchema } from '@/lib/schemas'
import { CONTRIBUTE_FORM_COPY } from '@/constants/contribute'

type FormData = z.input<typeof ContributeSchema>

type ContributionType = FormData['contributionTypes'][number]

const COPY = CONTRIBUTE_FORM_COPY

/**
 * Contribute form — matches .planning/mockups/contribution-form.html.
 *
 * Fields: name, email, contribution types (multi-select chips),
 * "tell us more" optional textarea, availability dropdown, privacy consent.
 *
 * Privacy consent is required to submit (ContributeSchema uses z.literal(true))
 * and is NOT persisted to Notion — it's a submission precondition only.
 *
 * Pattern mirrors MembershipForm.tsx: react-hook-form + Zod, honeypot,
 * form-load-time check, rate-limit handling, FormSuccess replacement.
 */
export function ContributeForm() {
  const trapRef = useRef('')
  const loadTime = useRef(0)
  useEffect(() => {
    loadTime.current = Date.now()
  }, [])

  const [success, setSuccess] = useState(false)
  const [submitWarning, setSubmitWarning] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ContributeSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      name: '',
      email: '',
      contributionTypes: [],
      description: '',
      // availability has no "empty" value in the schema — we rely on the
      // disabled placeholder option so RHF sees the first user selection as
      // the first valid value. Undefined is tolerated at runtime.
      availability: undefined as unknown as FormData['availability'],
      consent: false,
    },
  })

  const onSubmit = async (data: FormData) => {
    if (isRateLimited) return
    setSubmitWarning(null)
    setSubmitError(null)
    try {
      const res = await fetch('/api/applications/contribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          _trap: trapRef.current,
          _t: loadTime.current,
        }),
      })

      if (res.status === 429) {
        const retryAfterRaw = res.headers.get('Retry-After')
        const waitSeconds = retryAfterRaw ? parseInt(retryAfterRaw, 10) : 30
        const safeWait = isNaN(waitSeconds) ? 30 : waitSeconds
        setSubmitWarning(
          "You've submitted several times recently. Please wait a few minutes before trying again."
        )
        setIsRateLimited(true)
        setTimeout(() => setIsRateLimited(false), safeWait * 1000)
        return
      }

      if (!res.ok) {
        try {
          const body = await res.json()
          if (body.fieldErrors && typeof body.fieldErrors === 'object') {
            const firstError = Object.values(body.fieldErrors).flat()[0]
            setSubmitError(
              typeof firstError === 'string'
                ? firstError
                : 'Please check your input and try again.'
            )
          } else if (body.error && typeof body.error === 'string') {
            setSubmitError(body.error)
          } else {
            setSubmitError('Something went wrong. Please try again.')
          }
        } catch {
          setSubmitError('Something went wrong. Please try again.')
        }
        return
      }

      setSuccess(true)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  if (success) {
    return (
      <div
        className="relative overflow-hidden"
        style={{
          background: '#101010',
          border: '1px solid #1E1E1E',
          borderRadius: '3px',
          padding: '56px 48px',
          textAlign: 'center',
        }}
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-6 flex items-center justify-center"
          style={{
            width: '52px',
            height: '52px',
            border: '1px solid #39E87C',
            borderRadius: '50%',
            color: '#39E87C',
            background: 'rgba(57,232,124,0.06)',
            fontSize: '20px',
            boxShadow: '0 0 24px rgba(57,232,124,0.12)',
          }}
        >
          {COPY.success.icon}
        </div>
        <h3
          className="font-display text-foreground mb-3"
          style={{
            fontSize: '34px',
            letterSpacing: '0.04em',
          }}
        >
          {COPY.success.title}
        </h3>
        <p
          className="font-body text-[14px] leading-[1.7] mx-auto"
          style={{
            maxWidth: '320px',
            color: '#666',
            fontWeight: 300,
          }}
        >
          {COPY.success.message}
        </p>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: '#101010',
        border: '1px solid #1E1E1E',
        borderRadius: '3px',
      }}
    >
      {/* Top accent bar — mockup .card-accent */}
      <div
        aria-hidden="true"
        className="h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(192,192,192,.08) 20%, rgba(192,192,192,.38) 50%, rgba(192,192,192,.08) 80%, transparent)',
        }}
      />

      {/* Header */}
      <div
        className="border-b"
        style={{
          borderColor: '#1E1E1E',
          padding: '44px 48px 36px',
        }}
      >
        <div className="font-body uppercase text-[10px] tracking-[0.22em] text-[color:#666] flex items-center gap-[10px] mb-[14px]">
          <span aria-hidden="true" className="block h-px w-[18px] bg-[#4A4A4A]" />
          {COPY.eyebrow}
        </div>
        <h2
          className="font-display text-foreground leading-[0.95] mb-[18px]"
          style={{
            fontSize: '44px',
            letterSpacing: '0.03em',
          }}
        >
          {COPY.titleLines.lead}
          <br />
          <em className="text-silver not-italic">{COPY.titleLines.emphasis}</em>
        </h2>
        <p
          className="font-body text-[13.5px] leading-[1.72]"
          style={{
            color: '#666',
            fontWeight: 300,
            maxWidth: '400px',
          }}
        >
          {COPY.sub.line1}
          <br />
          {COPY.sub.line2}
        </p>
      </div>

      {/* Body / form */}
      <div style={{ padding: '40px 48px 52px' }}>
        {/*
          handleSubmit(onSubmit) returns a deferred event handler; refs are
          only dereferenced later inside that handler. Matches the existing
          MembershipForm pattern — React Compiler's refs rule is conservative
          here. See src/components/forms/MembershipForm.tsx:117.
        */}
        {/* eslint-disable-next-line react-hooks/refs */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="on">
          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-[26px]">
            <TextField
              label={COPY.name.label}
              name="name"
              placeholder={COPY.name.placeholder}
              autoComplete={COPY.name.autocomplete}
              registration={register('name')}
              error={errors.name?.message}
            />
            <TextField
              label={COPY.email.label}
              name="email"
              type="email"
              placeholder={COPY.email.placeholder}
              autoComplete={COPY.email.autocomplete}
              registration={register('email')}
              error={errors.email?.message}
            />
          </div>

          {/* Contribution chips */}
          <div className="mb-[26px]">
            <FieldLabel>{COPY.contribute.label}</FieldLabel>
            <Controller
              name="contributionTypes"
              control={control}
              render={({ field }) => (
                <ChipGroup
                  options={COPY.contribute.chips}
                  selected={field.value ?? []}
                  onChange={field.onChange}
                  error={!!errors.contributionTypes}
                />
              )}
            />
            {errors.contributionTypes && (
              <div className="text-[11px] text-[#FF3D5A] mt-[6px]">
                {errors.contributionTypes.message ?? COPY.contribute.error}
              </div>
            )}
          </div>

          {/* Tell us more */}
          <div className="mb-[26px]">
            <label
              htmlFor="more"
              className="font-body block uppercase text-[10.5px] font-medium tracking-[0.18em] text-silver mb-[9px]"
            >
              {COPY.more.label}{' '}
              <span
                className="normal-case tracking-[0.05em] text-[10px]"
                style={{ color: '#4A4A4A' }}
              >
                {COPY.more.labelNote}
              </span>
            </label>
            <textarea
              id="more"
              {...register('description')}
              placeholder={COPY.more.placeholder}
              className="contribute-input w-full"
              style={{
                ...INPUT_STYLE,
                minHeight: '100px',
                resize: 'vertical',
                lineHeight: 1.65,
              }}
            />
            {errors.description?.message && (
              <div className="text-[11px] text-[#FF3D5A] mt-[6px]">{errors.description.message}</div>
            )}
          </div>

          {/* Availability */}
          <div className="mb-[26px] relative">
            <label
              htmlFor="availability"
              className="font-body block uppercase text-[10.5px] font-medium tracking-[0.18em] text-silver mb-[9px]"
            >
              {COPY.availability.label}
            </label>
            <div className="relative">
              <select
                id="availability"
                {...register('availability')}
                defaultValue=""
                className="contribute-input w-full cursor-pointer"
                style={{
                  ...INPUT_STYLE,
                  paddingRight: '36px',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="" disabled>
                  {COPY.availability.placeholder}
                </option>
                {COPY.availability.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '5px solid #4A4A4A',
                }}
              />
            </div>
            {errors.availability?.message && (
              <div className="text-[11px] text-[#FF3D5A] mt-[6px]">
                {errors.availability.message}
              </div>
            )}
          </div>

          <div className="h-px my-8" style={{ background: '#1E1E1E' }} />

          {/* Privacy consent */}
          <div className="mb-8">
            <div className="font-body uppercase text-[10.5px] font-medium tracking-[0.18em] text-silver mb-[10px]">
              {COPY.consent.label}
            </div>
            <Controller
              name="consent"
              control={control}
              render={({ field }) => (
                <div className="flex items-start gap-[13px]">
                  <div className="relative flex-shrink-0 w-[18px] h-[18px] mt-px">
                    <input
                      id="consent"
                      type="checkbox"
                      checked={field.value === true}
                      onChange={(e) => field.onChange(e.target.checked)}
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={errors.consent ? 'consent-error' : undefined}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                      className="w-[18px] h-[18px] flex items-center justify-center transition-all"
                      style={{
                        border: `1px solid ${field.value === true ? '#39E87C' : '#2A2A2A'}`,
                        borderRadius: '2px',
                        background:
                          field.value === true ? 'rgba(57,232,124,0.06)' : '#141414',
                        color: field.value === true ? '#39E87C' : 'transparent',
                        fontSize: '11px',
                        boxShadow:
                          field.value === true
                            ? '0 0 0 2px rgba(57,232,124,0.12)'
                            : undefined,
                      }}
                      aria-hidden="true"
                    >
                      ✓
                    </div>
                  </div>
                  <label
                    htmlFor="consent"
                    className="font-body text-[13px] leading-[1.65] cursor-pointer"
                    style={{ color: '#666', fontWeight: 300 }}
                  >
                    {COPY.consent.text}{' '}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-silver underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      {COPY.consent.policyLink}
                    </Link>
                  </label>
                </div>
              )}
            />
            {errors.consent && (
              <div id="consent-error" className="text-[11px] text-[#FF3D5A] mt-2">
                {errors.consent.message ?? COPY.consent.error}
              </div>
            )}
          </div>

          {/* Honeypot */}
          <input
            type="text"
            name="_trap"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            style={{ display: 'none' }}
            onChange={(e) => {
              trapRef.current = e.target.value
            }}
          />

          {submitWarning && (
            <div className="mb-4 text-[11px] text-[color:var(--color-warning)] leading-[1.5]">
              {submitWarning}
            </div>
          )}
          {submitError && (
            <div className="mb-4 text-[13px] text-[color:var(--color-error)] leading-[1.5]">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isRateLimited}
            className="w-full font-display uppercase transition-[background,transform,box-shadow] duration-200 hover:bg-silver disabled:opacity-[0.35] disabled:cursor-not-allowed"
            style={{
              padding: '14px 24px',
              background: '#F2F2F2',
              color: '#0C0C0C',
              border: 'none',
              borderRadius: '3px',
              fontSize: '20px',
              letterSpacing: '0.1em',
              cursor: isSubmitting || isRateLimited ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Sending…' : COPY.submit}
          </button>
        </form>
      </div>

      {/* Shared styles for .contribute-input focus + placeholder — scoped by class */}
      <style>{`
        .contribute-input::placeholder { color: #4A4A4A; }
        .contribute-input:focus {
          border-color: rgba(192,192,192,.28) !important;
          background: #161616 !important;
          box-shadow: 0 0 0 3px rgba(192,192,192,.04) !important;
        }
        .contribute-input option { background: #111; color: #F2F2F2; }
      `}</style>
    </div>
  )
}

// ─── Small primitives — scoped to this form so we don't perturb other forms ──

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: '#141414',
  border: '1px solid #2A2A2A',
  borderRadius: '3px',
  color: '#F2F2F2',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  fontWeight: 300,
  padding: '11px 14px',
  outline: 'none',
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-body uppercase text-[10.5px] font-medium tracking-[0.18em] text-silver mb-[9px]">
      {children}
    </div>
  )
}

interface TextFieldProps {
  label: string
  name: string
  placeholder: string
  type?: 'text' | 'email'
  autoComplete?: string
  registration: ReturnType<ReturnType<typeof useForm<FormData>>['register']>
  error?: string | undefined
}

function TextField({
  label,
  name,
  placeholder,
  type = 'text',
  autoComplete,
  registration,
  error,
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-body block uppercase text-[10.5px] font-medium tracking-[0.18em] text-silver mb-[9px]"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className="contribute-input"
        style={INPUT_STYLE}
        {...registration}
      />
      {error && <div className="text-[11px] text-[#FF3D5A] mt-[6px]">{error}</div>}
    </div>
  )
}

interface ChipGroupProps {
  options: readonly { value: string; label: string }[]
  selected: string[]
  onChange: (next: ContributionType[]) => void
  error?: boolean
}

function ChipGroup({ options, selected, onChange, error }: ChipGroupProps) {
  const toggle = (value: string) => {
    const isOn = selected.includes(value)
    const next = isOn
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(next as ContributionType[])
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Contribution areas"
      data-error={error ? 'true' : undefined}
    >
      {options.map((opt) => {
        const isOn = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            aria-pressed={isOn}
            className="inline-flex items-center gap-[6px] font-body text-[12.5px] transition-all duration-200 hover:-translate-y-px"
            style={{
              padding: '7px 14px',
              border: `1px solid ${
                isOn ? '#39E87C' : error ? 'rgba(255,61,90,0.22)' : '#2A2A2A'
              }`,
              borderRadius: '2px',
              color: isOn ? '#39E87C' : '#666',
              background: isOn ? 'rgba(57,232,124,0.06)' : '#141414',
              boxShadow: isOn ? '0 0 0 2px rgba(57,232,124,0.12)' : undefined,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <span
              aria-hidden="true"
              className="block w-[5px] h-[5px] rounded-full"
              style={{
                border: `1px solid ${isOn ? '#39E87C' : 'currentColor'}`,
                background: isOn ? '#39E87C' : 'transparent',
                flexShrink: 0,
              }}
            />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
