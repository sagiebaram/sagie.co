'use client'
'use no memo' // react-hook-form's useFormContext().watch() is not compiler-safe

import { useFormContext } from 'react-hook-form'

import type { MembershipFormData } from '@/components/forms/MembershipWizard'
import { workStyleOptions } from '@/lib/schemas'
import { FormField } from '@/components/ui/FormField'

export function StepProfessionalIdentity() {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<MembershipFormData>()

  const workStyle = watch('workStyle') ?? []
  const showCompanyField = workStyle.includes('Company')
  const showOrganizationField = workStyle.includes('Organization')
  const showFreelancerField = workStyle.includes('Freelancer')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FormField
        label="How do you work?"
        name="workStyle"
        type="checkbox-group"
        options={[...workStyleOptions]}
        required
        value={workStyle}
        onArrayChange={(v) => setValue('workStyle', v as MembershipFormData['workStyle'], { shouldValidate: true })}
        error={errors.workStyle?.message}
      />

      {showCompanyField && (
        <div aria-live="polite">
          <FormField
            label="Company name"
            name="companyName"
            placeholder="Your company"
            registration={register('companyName')}
            error={errors.companyName?.message}
          />
        </div>
      )}

      {showOrganizationField && (
        <div aria-live="polite">
          <FormField
            label="Organization name"
            name="organizationName"
            placeholder="Your organization"
            registration={register('organizationName')}
            error={errors.organizationName?.message}
          />
        </div>
      )}

      {showFreelancerField && (
        <div aria-live="polite">
          <FormField
            label="What do you do?"
            name="freelancerDescription"
            placeholder="Describe what you do"
            registration={register('freelancerDescription')}
            error={errors.freelancerDescription?.message}
          />
        </div>
      )}
    </div>
  )
}
