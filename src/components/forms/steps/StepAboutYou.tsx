'use client'

import { useFormContext } from 'react-hook-form'

import type { MembershipFormData } from '@/components/forms/MembershipWizard'
import { FormField } from '@/components/ui/FormField'
import { PhoneField } from '@/components/ui/PhoneField'

export function StepAboutYou() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MembershipFormData>()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FormField
        label="Full Name"
        name="fullName"
        placeholder="Your full name"
        required
        registration={register('fullName')}
        error={errors.fullName?.message}
        autoComplete="name"
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        registration={register('email')}
        error={errors.email?.message}
        autoComplete="email"
      />

      <PhoneField
        label="Phone"
        name="phone"
        control={control}
        error={errors.phone?.message}
        required
      />

      <FormField
        label="LinkedIn URL"
        name="linkedIn"
        type="url"
        placeholder="https://linkedin.com/in/you"
        registration={register('linkedIn')}
        error={errors.linkedIn?.message}
        autoComplete="url"
      />
    </div>
  )
}
