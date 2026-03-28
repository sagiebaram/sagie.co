'use client'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select' | undefined
  placeholder?: string | undefined
  required?: boolean | undefined
  options?: string[] | undefined
  value: string
  onChange: (value: string) => void
  error?: string | undefined
}

export function FormField({
  label, name, type = 'text', placeholder, required,
  options, value, onChange, error
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
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
        >
          <option value="">Select...</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={inputStyle}
        />
      )}

      {error && (
        <span style={{ fontSize: '10px', color: '#c0392b' }}>{error}</span>
      )}
    </div>
  )
}
