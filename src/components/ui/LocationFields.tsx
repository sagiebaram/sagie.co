'use client'

import { useEffect, useRef, useMemo } from 'react'
import { FormField } from '@/components/ui/FormField'
import { SORTED_COUNTRIES, getStates, getCities, countryHasStates, sortedCities } from '@/lib/location'

interface LocationFieldsProps {
  country: string
  state: string
  city: string
  onCountryChange: (value: string) => void
  onStateChange: (value: string) => void
  onCityChange: (value: string) => void
  countryError?: string | undefined
  stateError?: string | undefined
  cityError?: string | undefined
  cityLabel?: string | undefined
  cityPlaceholder?: string | undefined
  required?: boolean | undefined
}

export function LocationFields({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  countryError,
  stateError,
  cityError,
  cityLabel = 'City',
  cityPlaceholder = 'Where are you based?',
  required = true,
}: LocationFieldsProps) {
  const prevCountry = useRef(country)
  const prevState = useRef(state)

  // Country change → reset state + city
  useEffect(() => {
    if (prevCountry.current !== country) {
      onStateChange('')
      onCityChange('')
      prevCountry.current = country
    }
  }, [country, onStateChange, onCityChange])

  // State change → reset city
  useEffect(() => {
    if (prevState.current !== state) {
      onCityChange('')
      prevState.current = state
    }
  }, [state, onCityChange])

  const states = useMemo(() => (country ? getStates(country) : []), [country])
  const hasStates = states.length > 0

  const rawCities = useMemo(() => {
    if (!country) return []
    if (hasStates && state) return getCities(country, state)
    if (!hasStates) return getCities(country)
    return []
  }, [country, state, hasStates])

  const cities = useMemo(
    () => sortedCities(country, rawCities),
    [country, rawCities],
  )

  const countryOptions = useMemo(
    () => SORTED_COUNTRIES.map((c) => c.isoCode),
    [],
  )

  const countryLabels = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of SORTED_COUNTRIES) {
      map[c.isoCode] = c.name
    }
    return map
  }, [])

  const stateOptions = useMemo(
    () => states.map((s) => s.isoCode),
    [states],
  )

  const stateLabels = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of states) {
      map[s.isoCode] = s.name
    }
    return map
  }, [states])

  const cityOptions = useMemo(
    () => cities.map((c) => c.name),
    [cities],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Country + State row */}
      <div style={{ display: 'grid', gridTemplateColumns: hasStates ? '1fr 1fr' : '1fr', gap: '16px' }}>
        <FormField
          label="Country"
          name="country"
          type="select"
          options={countryOptions}
          optionLabels={countryLabels}
          required={required}
          value={country}
          onValueChange={onCountryChange}
          error={countryError}
        />
        {hasStates && (
          <FormField
            label="State / Province"
            name="state"
            type="select"
            options={stateOptions}
            optionLabels={stateLabels}
            required={required}
            value={state}
            onValueChange={onStateChange}
            error={stateError}
          />
        )}
      </div>

      {/* City */}
      {cityOptions.length > 0 ? (
        <FormField
          label={cityLabel}
          name="city"
          type="select"
          options={cityOptions}
          required={required}
          value={city}
          onValueChange={onCityChange}
          allowOther
          error={cityError}
        />
      ) : (
        <FormField
          label={cityLabel}
          name="city"
          placeholder={country ? cityPlaceholder : 'Select a country first'}
          required={required}
          value={city}
          onValueChange={onCityChange}
          error={cityError}
        />
      )}
    </div>
  )
}
