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

  // Use shouldDirty instead of shouldValidate to avoid triggering the full
  // MembershipSchema resolver (which includes superRefines for all steps) on
  // every country/state/city selection. Validation runs on blur and on Next.
  return (
    <LocationFields
      country={country}
      state={state}
      city={city}
      onCountryChange={(v) => setValue('country', v, { shouldDirty: true })}
      onStateChange={(v) => setValue('state', v, { shouldDirty: true })}
      onCityChange={(v) => setValue('city', v, { shouldDirty: true })}
      countryError={errors.country?.message}
      stateError={errors.state?.message}
      cityError={errors.city?.message}
      required
    />
  )
}
