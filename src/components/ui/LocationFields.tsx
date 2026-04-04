'use client'

import { useEffect, useRef } from 'react'
import { FormField } from '@/components/ui/FormField'
import { COUNTRY_OPTIONS, getCityOptions } from '@/lib/schemas'

interface LocationFieldsProps {
  country: string
  city: string
  onCountryChange: (value: string) => void
  onCityChange: (value: string) => void
  countryError?: string | undefined
  cityError?: string | undefined
  cityLabel?: string | undefined
  cityPlaceholder?: string | undefined
  countryRequired?: boolean | undefined
  cityRequired?: boolean | undefined
}

export function LocationFields({
  country,
  city,
  onCountryChange,
  onCityChange,
  countryError,
  cityError,
  cityLabel = 'City',
  cityPlaceholder = 'Where are you based?',
  countryRequired = true,
  cityRequired = true,
}: LocationFieldsProps) {
  const prevCountry = useRef(country)

  // Reset city when country changes
  useEffect(() => {
    if (prevCountry.current !== country) {
      onCityChange('')
      prevCountry.current = country
    }
  }, [country, onCityChange])

  const cityOptions = getCityOptions(country)
  const hasChapterCities = cityOptions.length > 1

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <FormField
        label="Country"
        name="country"
        type="select"
        options={[...COUNTRY_OPTIONS]}
        required={countryRequired}
        value={country}
        onValueChange={onCountryChange}
        error={countryError}
      />

      {hasChapterCities ? (
        <FormField
          label={cityLabel}
          name="city"
          type="select"
          options={cityOptions.filter(c => c !== 'Other')}
          required={cityRequired}
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
          required={cityRequired}
          value={city}
          onValueChange={onCityChange}
          error={cityError}
        />
      )}
    </div>
  )
}
