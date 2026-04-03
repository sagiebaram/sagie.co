'use client'

import PhoneInput from 'react-phone-number-input'
import type { E164Number } from 'libphonenumber-js'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import 'react-phone-number-input/style.css'

interface PhoneFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  error?: string | undefined
  required?: boolean | undefined
}

export function PhoneField<T extends FieldValues>({
  label, name, control, error, required,
}: PhoneFieldProps<T>) {
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
        }}
      >
        {label}{required && <span style={{ color: 'var(--silver)', marginLeft: '4px' }}>*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            id={name}
            international
            defaultCountry="US"
            value={(field.value as E164Number | undefined) ?? ''}
            onChange={(val) => field.onChange(val ?? '')}
            onBlur={field.onBlur}
            className="phone-input-dark"
            aria-describedby={error ? `${name}-error` : undefined}
            aria-invalid={error ? true : undefined}
          />
        )}
      />

      {error && (
        <span id={`${name}-error`} style={{ fontSize: '10px', color: 'var(--color-error)' }}>{error}</span>
      )}
    </div>
  )
}
