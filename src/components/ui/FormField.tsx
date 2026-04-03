'use client'

import { useState, useRef, useEffect } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox-group' | undefined
  placeholder?: string | undefined
  required?: boolean | undefined
  options?: string[] | undefined
  value?: string | string[] | undefined
  onValueChange?: ((value: string) => void) | undefined
  onArrayChange?: ((value: string[]) => void) | undefined
  registration?: UseFormRegisterReturn | undefined
  error?: string | undefined
  allowOther?: boolean | undefined
  autoComplete?: string | undefined
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-card)',
  border: '0.5px solid var(--border-default)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  padding: '12px 14px',
  outline: 'none',
  display: 'block',
}

function DropdownSelect({ name, options, value, placeholder, onValueChange, allowOther }: {
  name: string
  options: string[]
  value: string
  placeholder?: string | undefined
  onValueChange?: ((value: string) => void) | undefined
  allowOther?: boolean | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [otherText, setOtherText] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const allOptions = allowOther ? [...options, 'Other'] : options
  const isOtherSelected = allowOther && value === 'Other'
  const isCustomValue = allowOther && value !== '' && !allOptions.includes(value)
  const displayValue = isCustomValue ? 'Other' : value

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function handleSelect(option: string) {
    setIsOpen(false)
    setHighlightedIndex(-1)
    if (option === 'Other') {
      onValueChange?.('Other')
      setOtherText('')
    } else {
      setOtherText('')
      onValueChange?.(option)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsOpen(true)
        setHighlightedIndex(0)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(i => Math.min(i + 1, allOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const highlighted = highlightedIndex >= 0 ? allOptions[highlightedIndex] : undefined
      if (highlighted !== undefined) handleSelect(highlighted)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <input type="hidden" name={name} value={isCustomValue ? otherText : value} />
      <button
        id={name}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${name}-listbox`}
        aria-haspopup="listbox"
        data-dropdown={name}
        tabIndex={0}
        onClick={() => { setIsOpen(o => !o); if (!isOpen) setHighlightedIndex(-1) }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        style={{
          ...INPUT_STYLE,
          border: isFocused ? '0.5px solid var(--silver)' : INPUT_STYLE.border,
          cursor: 'pointer',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <span style={{
          color: displayValue ? 'var(--text-primary)' : 'var(--text-secondary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {displayValue || placeholder || 'Select...'}
        </span>
        <span style={{
          marginLeft: '8px',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
        }}>
          &#9660;
        </span>
      </button>

      {isOpen && (
        <div id={`${name}-listbox`} role="listbox" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border-default)',
          zIndex: 50,
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {allOptions.map((option, index) => (
            <div
              key={option}
              role="option"
              aria-selected={displayValue === option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: displayValue === option ? 'var(--silver)' : 'var(--text-secondary)',
                background: index === highlightedIndex ? 'rgba(255,255,255,0.05)' : 'transparent',
                userSelect: 'none',
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {(isOtherSelected || isCustomValue) && (
        <input
          type="text"
          placeholder="Please specify..."
          value={otherText || (isCustomValue ? value : '')}
          onChange={e => { setOtherText(e.target.value); onValueChange?.(e.target.value) }}
          style={{ ...INPUT_STYLE, marginTop: '8px', boxSizing: 'border-box' }}
        />
      )}
    </div>
  )
}

export function FormField({
  label, name, type = 'text', placeholder, required,
  options, value, onValueChange, onArrayChange, registration, error, allowOther, autoComplete
}: FormFieldProps) {
  const stringValue = typeof value === 'string' ? value : ''

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
          style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: '1.6' }}
          {...(registration ?? { name, value: stringValue, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onValueChange?.(e.target.value) })}
        />
      ) : type === 'select' ? (
        <DropdownSelect
          name={name}
          options={options ?? []}
          value={stringValue}
          placeholder={placeholder}
          onValueChange={onValueChange}
          allowOther={allowOther}
        />
      ) : type === 'checkbox-group' ? (
        <div id={name} role="group" aria-labelledby={`${name}-label`} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {options?.map(opt => {
            const checkedValues: string[] = Array.isArray(value) ? value : []
            const isChecked = checkedValues.includes(opt)
            const toggle = () => {
              const next = isChecked
                ? checkedValues.filter(v => v !== opt)
                : [...checkedValues, opt]
              onArrayChange?.(next)
            }
            return (
              <div
                key={opt}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onClick={toggle}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle() } }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `0.5px solid ${isChecked ? 'var(--silver)' : 'var(--border-default)'}`,
                  background: isChecked ? 'var(--silver)' : 'var(--bg-card)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s, border-color 0.15s',
                }}>
                  {isChecked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="var(--bg-card)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  userSelect: 'none',
                }}>
                  {opt}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={INPUT_STYLE}
          {...(registration ?? { name, value: stringValue, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onValueChange?.(e.target.value) })}
        />
      )}

      {error && (
        <span style={{ fontSize: '10px', color: 'var(--color-error)' }}>{error}</span>
      )}
    </div>
  )
}
