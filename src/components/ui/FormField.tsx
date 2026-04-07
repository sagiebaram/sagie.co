'use client'

import { useState, useRef, useEffect } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

export interface OptionGroup {
  label: string
  options: string[]
}

type ValidationState = 'neutral' | 'valid' | 'invalid'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox-group' | undefined
  placeholder?: string | undefined
  required?: boolean | undefined
  options?: string[] | undefined
  optionGroups?: OptionGroup[] | undefined
  optionLabels?: Record<string, string> | undefined
  value?: string | string[] | undefined
  onValueChange?: ((value: string) => void) | undefined
  onArrayChange?: ((value: string[]) => void) | undefined
  registration?: UseFormRegisterReturn | undefined
  error?: string | undefined
  allowOther?: boolean | undefined
  autoComplete?: string | undefined
  isTouched?: boolean | undefined
  disabled?: boolean | undefined
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

function getValidationState(error: string | undefined, isTouched: boolean | undefined, value: string | string[] | undefined): ValidationState {
  if (!isTouched) return 'neutral'
  if (error) return 'invalid'
  const hasValue = Array.isArray(value) ? value.length > 0 : !!value
  if (hasValue) return 'valid'
  return 'neutral'
}

function getValidationBorderColor(state: ValidationState): string {
  if (state === 'valid') return 'var(--field-valid)'
  if (state === 'invalid') return 'var(--field-invalid)'
  return 'var(--border-default)'
}

function CheckmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 7L6 10L11 4" stroke="var(--field-valid)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="5" width="8" height="6" rx="1" stroke="var(--text-dim)" strokeWidth="1" />
      <path d="M4 5V3.5C4 2.12 5.12 1 6.5 1h-1C4.12 1 3 2.12 3 3.5V5" stroke="var(--text-dim)" strokeWidth="1" />
      <path d="M8 5V3.5C8 2.12 7.12 1 6 1s-2 1.12-2 2.5" stroke="var(--text-dim)" strokeWidth="1" />
    </svg>
  )
}

function DropdownSelect({ name, options, optionGroups, value, placeholder, onValueChange, allowOther, optionLabels, validationState, disabled }: {
  name: string
  options: string[]
  optionGroups?: OptionGroup[] | undefined
  value: string
  placeholder?: string | undefined
  onValueChange?: ((value: string) => void) | undefined
  allowOther?: boolean | undefined
  optionLabels?: Record<string, string> | undefined
  validationState: ValidationState
  disabled?: boolean | undefined
}) {
  const getLabel = (option: string) => optionLabels?.[option] ?? option
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [otherText, setOtherText] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const flatOptions = optionGroups
    ? optionGroups.flatMap((g) => g.options)
    : options
  const allOptions = allowOther ? [...flatOptions, 'Other'] : flatOptions
  const isOtherSelected = allowOther && value === 'Other'
  const isCustomValue = allowOther && value !== '' && !allOptions.includes(value)
  const displayValue = isCustomValue ? 'Other' : getLabel(value)

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

  const borderColor = isFocused
    ? '0.5px solid var(--silver)'
    : `0.5px solid ${getValidationBorderColor(validationState)}`

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }} className={disabled ? 'field-locked' : undefined}>
      <input type="hidden" name={name} value={isCustomValue ? otherText : value} />
      <button
        id={name}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${name}-listbox`}
        aria-haspopup="listbox"
        data-dropdown={name}
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        onClick={() => { if (!disabled) { setIsOpen(o => !o); if (!isOpen) setHighlightedIndex(-1) } }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className="field-transition"
        style={{
          ...INPUT_STYLE,
          border: borderColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
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
          {disabled && !displayValue ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <LockIcon />
              {placeholder || 'Select...'}
            </span>
          ) : (
            displayValue || placeholder || 'Select...'
          )}
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
          {optionGroups ? (
            (() => {
              let idx = 0
              const groupsToRender = allowOther
                ? [...optionGroups, { label: '', options: ['Other'] }]
                : optionGroups
              return groupsToRender.map((group) => (
                <div key={group.label || '__other'} role="group" aria-label={group.label}>
                  {group.label && (
                    <div style={{
                      padding: '8px 14px 4px',
                      fontSize: '9px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-body)',
                      userSelect: 'none',
                    }}>
                      {group.label}
                    </div>
                  )}
                  {group.options.map((option) => {
                    const currentIdx = idx++
                    return (
                      <div
                        key={option}
                        role="option"
                        aria-selected={value === option}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setHighlightedIndex(currentIdx)}
                        style={{
                          padding: '10px 14px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: value === option ? 'var(--silver)' : 'var(--text-secondary)',
                          background: currentIdx === highlightedIndex ? 'rgba(255,255,255,0.05)' : 'transparent',
                          userSelect: 'none',
                        }}
                      >
                        {getLabel(option)}
                      </div>
                    )
                  })}
                </div>
              ))
            })()
          ) : (
            allOptions.map((option, index) => (
              <div
                key={option}
                role="option"
                aria-selected={value === option}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: value === option ? 'var(--silver)' : 'var(--text-secondary)',
                  background: index === highlightedIndex ? 'rgba(255,255,255,0.05)' : 'transparent',
                  userSelect: 'none',
                }}
              >
                {getLabel(option)}
              </div>
            ))
          )}
        </div>
      )}

      {(isOtherSelected || isCustomValue) && (
        <input
          type="text"
          placeholder="Please specify..."
          value={otherText || (isCustomValue ? value : '')}
          onChange={e => { setOtherText(e.target.value); onValueChange?.(e.target.value) }}
          className="field-transition"
          style={{ ...INPUT_STYLE, marginTop: '8px', boxSizing: 'border-box' }}
        />
      )}
    </div>
  )
}

export function FormField({
  label, name, type = 'text', placeholder, required,
  options, optionGroups, optionLabels, value, onValueChange, onArrayChange, registration, error, allowOther, autoComplete,
  isTouched, disabled
}: FormFieldProps) {
  const stringValue = typeof value === 'string' ? value : ''
  const validationState = getValidationState(error, isTouched, value ?? stringValue)

  const inputBorder = validationState !== 'neutral'
    ? `0.5px solid ${getValidationBorderColor(validationState)}`
    : INPUT_STYLE.border

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }} className={disabled ? 'field-locked' : undefined}>
      <label
        id={`${name}-label`}
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
        {validationState === 'valid' && <CheckmarkIcon />}
        {disabled && <LockIcon />}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          placeholder={placeholder}
          rows={4}
          disabled={disabled}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className="field-transition"
          style={{ ...INPUT_STYLE, border: inputBorder, resize: 'vertical', lineHeight: '1.6' }}
          {...(registration ?? { name, value: stringValue, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => onValueChange?.(e.target.value) })}
        />
      ) : type === 'select' ? (
        <DropdownSelect
          name={name}
          options={options ?? []}
          optionGroups={optionGroups}
          value={stringValue}
          placeholder={placeholder}
          onValueChange={onValueChange}
          allowOther={allowOther}
          optionLabels={optionLabels}
          validationState={validationState}
          disabled={disabled}
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
          placeholder={disabled ? '' : placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className="field-transition"
          style={{ ...INPUT_STYLE, border: inputBorder }}
          {...(registration ?? { name, value: stringValue, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onValueChange?.(e.target.value) })}
        />
      )}

      <div
        id={`${name}-error`}
        className={`field-error-text ${error ? 'field-error-visible' : ''}`}
        role={error ? 'alert' : undefined}
      >
        {error ?? ''}
      </div>
    </div>
  )
}
