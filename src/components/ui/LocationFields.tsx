'use client'

import { useEffect, useRef, useMemo } from 'react'
import { FormField, type OptionGroup } from '@/components/ui/FormField'
import { SORTED_COUNTRIES, getStates, getCities, showStateField, sortedCities } from '@/lib/location'
import { getCuratedCities } from '@/lib/locationData'

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

  // Country change → reset state + city, auto-select single-city countries
  useEffect(() => {
    if (prevCountry.current !== country) {
      onStateChange('')
      const curated = getCuratedCities(country)
      const allCities = curated?.flatMap((g) => g.cities) ?? []
      if (allCities.length === 1 && allCities[0]) {
        onCityChange(allCities[0])
      } else {
        onCityChange('')
      }
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

  const hasStateField = showStateField(country)
  const states = useMemo(() => (hasStateField ? getStates(country) : []), [country, hasStateField])

  // --- City resolution: curated groups take priority over library data ---
  const curatedGroups = useMemo(
    () => getCuratedCities(country, state),
    [country, state],
  )

  const libraryCities = useMemo(() => {
    if (curatedGroups) return [] // curated takes priority
    if (!country) return []
    if (hasStateField && state) return getCities(country, state)
    if (!hasStateField) return getCities(country)
    return []
  }, [country, state, hasStateField, curatedGroups])

  const sortedLibCities = useMemo(
    () => sortedCities(country, libraryCities),
    [country, libraryCities],
  )

  // Convert library cities to flat options (existing behavior)
  const flatCityOptions = useMemo(
    () => sortedLibCities.map((c) => c.name),
    [sortedLibCities],
  )

  // --- Country/state option helpers (unchanged) ---
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

  // Decide if city should be shown (need country, and if state-field country, need state)
  const showCity = country && (!hasStateField || state)

  // Convert curated groups to OptionGroup[] for FormField
  const cityOptionGroups: OptionGroup[] | undefined = curatedGroups
    ? curatedGroups.map((g) => ({ label: g.label, options: g.cities }))
    : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Country + State row */}
      <div style={{ display: 'grid', gridTemplateColumns: hasStateField ? '1fr 1fr' : '1fr', gap: '16px' }}>
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
        {hasStateField && (
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
      {showCity ? (
        cityOptionGroups ? (
          // Curated grouped city list
          <FormField
            label={cityLabel}
            name="city"
            type="select"
            optionGroups={cityOptionGroups}
            required={required}
            value={city}
            onValueChange={onCityChange}
            allowOther
            error={cityError}
          />
        ) : flatCityOptions.length > 0 ? (
          // Library city data (flat list, chapter cities sorted first)
          <FormField
            label={cityLabel}
            name="city"
            type="select"
            options={flatCityOptions}
            required={required}
            value={city}
            onValueChange={onCityChange}
            allowOther
            error={cityError}
          />
        ) : (
          // No city data — free text
          <FormField
            label={cityLabel}
            name="city"
            placeholder={cityPlaceholder}
            required={required}
            value={city}
            onValueChange={onCityChange}
            error={cityError}
          />
        )
      ) : (
        // Country not selected yet, or state-field country without state selected
        <FormField
          label={cityLabel}
          name="city"
          placeholder={!country ? 'Select a country first' : 'Select a state first'}
          required={required}
          value={city}
          onValueChange={onCityChange}
          error={cityError}
        />
      )}
    </div>
  )
}
