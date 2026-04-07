'use client'

import PhoneInput, { getCountries } from 'react-phone-number-input'
import type { E164Number } from 'libphonenumber-js'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import 'react-phone-number-input/style.css'
import type { Country } from 'react-phone-number-input'

const FILTERED_PHONE_COUNTRIES = new Set<Country>(['PS'])
const PHONE_COUNTRIES = getCountries().filter((c) => !FILTERED_PHONE_COUNTRIES.has(c))

interface PhoneFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  error?: string | undefined
  required?: boolean | undefined
  isTouched?: boolean | undefined
}

export function PhoneField<T extends FieldValues>({
  label, name, control, error, required, isTouched,
}: PhoneFieldProps<T>) {
  const validationClass = isTouched
    ? error ? 'phone-invalid' : 'phone-valid'
    : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={name}
        style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>
          {label}{required && <span style={{ color: 'var(--silver)', marginLeft: '4px' }}>*</span>}
        </span>
        {isTouched && !error && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
            <path d="M3 7L6 10L11 4" stroke="var(--field-valid)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            id={name}
            international
            defaultCountry="US"
            countries={PHONE_COUNTRIES}
            value={(field.value as E164Number | undefined) ?? ''}
            onChange={(val) => field.onChange(val ?? '')}
            onBlur={field.onBlur}
            className={`phone-input-dark ${validationClass}`}
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={error ? true : undefined}
          />
        )}
      />

      <div
        id={`${name}-error`}
        className={`phone-error-text ${error ? 'phone-error-visible' : ''}`}
        role={error ? 'alert' : undefined}
      >
        {error ?? ''}
      </div>
    </div>
  )
}
