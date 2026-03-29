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
  value?: string | undefined
  onChange?: ((value: string) => void) | undefined
  onValueChange?: ((value: string) => void) | undefined
  registration?: UseFormRegisterReturn | undefined
  error?: string | undefined
  allowOther?: boolean | undefined
}

export function FormField({
  label, name, type = 'text', placeholder, required,
  options, value, onChange, onValueChange, registration, error, allowOther
}: FormFieldProps) {
  const inputStyle: React.CSSProperties = {
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

  // Custom dropdown state
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [otherText, setOtherText] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Build options list (append "Other" if allowOther is true)
  const allOptions = allowOther
    ? [...(options ?? []), 'Other']
    : (options ?? [])

  const isOtherSelected = allowOther && value === 'Other'
  // When allowOther, if the value is not in the predefined list and not empty, it's an "Other" free-text
  const isCustomValue = allowOther && value !== '' && value !== undefined && !allOptions.includes(value ?? '')

  // Display value in trigger: show "Other" if it's a custom value, else show the value
  const displayValue = isCustomValue ? 'Other' : (value || '')

  // Click-outside handler
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
      // Select "Other" — value stays as 'Other' until user types in free-text
      onValueChange?.('Other')
      setOtherText('')
    } else {
      setOtherText('')
      onValueChange?.(option)
    }
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
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
      if (highlighted !== undefined) {
        handleSelect(highlighted)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
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
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          {/* Hidden input for form selectors & assertions */}
          <input type="hidden" name={name} value={isCustomValue ? otherText : (value ?? '')} />

          {/* Trigger button */}
          <button
            id={name}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            data-dropdown={name}
            tabIndex={0}
            onClick={() => {
              setIsOpen(o => !o)
              if (!isOpen) setHighlightedIndex(-1)
            }}
            onKeyDown={handleTriggerKeyDown}
            style={{
              ...inputStyle,
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

          {/* Options panel */}
          {isOpen && (
            <div
              role="listbox"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border-default)',
                zIndex: 50,
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {allOptions.map((option, index) => {
                const isSelected = displayValue === option
                const isHighlighted = index === highlightedIndex
                return (
                  <div
                    key={option}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: isSelected ? 'var(--silver)' : 'var(--text-secondary)',
                      background: isHighlighted ? 'rgba(255,255,255,0.05)' : 'transparent',
                      userSelect: 'none',
                    }}
                  >
                    {option}
                  </div>
                )
              })}
            </div>
          )}

          {/* Free-text input for "Other" */}
          {(isOtherSelected || isCustomValue) && (
            <input
              type="text"
              placeholder="Please specify..."
              value={otherText || (isCustomValue ? value : '')}
              onChange={e => {
                setOtherText(e.target.value)
                onValueChange?.(e.target.value)
              }}
              style={{
                ...inputStyle,
                marginTop: '8px',
                boxSizing: 'border-box',
              }}
            />
          )}
        </div>
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
