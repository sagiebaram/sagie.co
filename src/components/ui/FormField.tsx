'use client'

import type { UseFormRegisterReturn } from 'react-hook-form'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox-group' | undefined
  placeholder?: string | undefined
  required?: boolean | undefined
  options?: string[] | undefined
  value?: string | undefined
  onChange?: ((value: string) => void) | undefined
  registration?: UseFormRegisterReturn | undefined
  error?: string | undefined
}

export function FormField({
  label, name, type = 'text', placeholder, required,
  options, value, onChange, registration, error
}: FormFieldProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-card)',
    border: `0.5px solid ${error ? '#c0392b' : 'var(--border-default)'}`,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    padding: '12px 14px',
    outline: 'none',
    display: 'block',
  }

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

      {type === 'textarea' ? (
        <textarea
          id={name}
          placeholder={placeholder}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
          {...(registration
            ? registration
            : { name, value: value ?? '', onChange: e => onChange?.(e.target.value) }
          )}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
          {...(registration
            ? registration
            : { name, value: value ?? '', onChange: e => onChange?.(e.target.value) }
          )}
        >
          <option value="">Select...</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'checkbox-group' ? (
        <>
          <style>{`.rhf-checkbox:checked { background: var(--silver); border-color: var(--silver); }`}</style>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {options?.map(opt => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="rhf-checkbox"
                  value={opt}
                  style={{
                    appearance: 'none',
                    width: '16px',
                    height: '16px',
                    border: '0.5px solid var(--border-default)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  {...(registration ? registration : { name })}
                />
                <span style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {opt}
                </span>
              </label>
            ))}
          </div>
        </>
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          style={inputStyle}
          {...(registration
            ? registration
            : { name, value: value ?? '', onChange: e => onChange?.(e.target.value) }
          )}
        />
      )}

      {error && (
        <span style={{ fontSize: '10px', color: '#c0392b' }}>{error}</span>
      )}
    </div>
  )
}
