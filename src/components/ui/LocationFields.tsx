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
  countryTouched?: boolean | undefined
  stateTouched?: boolean | undefined
  cityTouched?: boolean | undefined
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
  countryTouched,
  stateTouched,
  cityTouched,
}: LocationFieldsProps) {
  const prevCountry = useRef(country)
  const prevState = useRef(state)

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

  useEffect(() => {
    if (prevState.current !== state) {
      onCityChange('')
      prevState.current = state
    }
  }, [state, onCityChange])

  const hasStateField = showStateField(country)
  const states = useMemo(() => (hasStateField ? getStates(country) : []), [country, hasStateField])

  const curatedGroups = useMemo(
    () => getCuratedCities(country, state),
    [country, state],
  )

  const libraryCities = useMemo(() => {
    if (curatedGroups) return []
    if (!country) return []
    if (hasStateField && state) return getCities(country, state)
    if (!hasStateField) return getCities(country)
    return []
  }, [country, state, hasStateField, curatedGroups])

  const sortedLibCities = useMemo(
    () => sortedCities(country, libraryCities),
    [country, libraryCities],
  )

  const flatCityOptions = useMemo(
    () => sortedLibCities.map((c) => c.name),
    [sortedLibCities],
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

  const stateDisabled = !country
  const cityDisabled = !country || (hasStateField && !state)
  const showCity = country && (!hasStateField || state)

  const cityOptionGroups: OptionGroup[] | undefined = curatedGroups
    ? curatedGroups.map((g) => ({ label: g.label, options: g.cities }))
    : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          isTouched={countryTouched}
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
            isTouched={stateTouched}
            disabled={stateDisabled}
          />
        )}
      </div>

      {showCity ? (
        cityOptionGroups ? (
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
            isTouched={cityTouched}
          />
        ) : flatCityOptions.length > 0 ? (
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
            isTouched={cityTouched}
          />
        ) : (
          <FormField
            label={cityLabel}
            name="city"
            placeholder={cityPlaceholder}
            required={required}
            value={city}
            onValueChange={onCityChange}
            error={cityError}
            isTouched={cityTouched}
          />
        )
      ) : (
        <FormField
          label={cityLabel}
          name="city"
          placeholder={!country ? 'Select a country first' : 'Select a state first'}
          required={required}
          value={city}
          onValueChange={onCityChange}
          error={cityError}
          isTouched={cityTouched}
          disabled={cityDisabled}
        />
      )}
    </div>
  )
}
