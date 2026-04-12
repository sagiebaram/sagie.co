'use client'

import { useFormContext } from 'react-hook-form'

import type { MembershipFormData } from '@/components/forms/MembershipWizard'
import { LocationFields } from '@/components/ui/LocationFields'

export function StepLocation() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MembershipFormData>()

  const country = watch('country') ?? ''
  const state = watch('state') ?? ''
  const city = watch('city') ?? ''

  return (
    <LocationFields
      country={country}
      state={state}
      city={city}
      onCountryChange={(v) => setValue('country', v, { shouldValidate: true })}
      onStateChange={(v) => setValue('state', v, { shouldValidate: true })}
      onCityChange={(v) => setValue('city', v, { shouldValidate: true })}
      countryError={errors.country?.message}
      stateError={errors.state?.message}
      cityError={errors.city?.message}
      required
    />
  )
}
