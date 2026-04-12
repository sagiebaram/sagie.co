'use client'

import { useFormContext } from 'react-hook-form'

import type { MembershipFormData } from '@/components/forms/MembershipWizard'
import { referralSourceOptions } from '@/lib/schemas'
import { FormField } from '@/components/ui/FormField'

export function StepTellUsMore() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MembershipFormData>()

  const referralSource = watch('referralSource') ?? ''
  const showReferralName = referralSource === 'Referral'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FormField
        label="What are you building or working on?"
        name="whatTheyNeed"
        type="textarea"
        placeholder="Tell us about your current project or focus"
        required
        registration={register('whatTheyNeed')}
        error={errors.whatTheyNeed?.message}
      />

      <FormField
        label="What are you looking for in a community?"
        name="communityExpectation"
        type="textarea"
        placeholder="What would make this community valuable to you?"
        required
        registration={register('communityExpectation')}
        error={errors.communityExpectation?.message}
      />

      <FormField
        label="What does a community mean to you?"
        name="communityMeaning"
        type="textarea"
        placeholder="Your perspective on what community means"
        required
        registration={register('communityMeaning')}
        error={errors.communityMeaning?.message}
      />

      <FormField
        label="Why SAGIE?"
        name="howTheyKnowSagie"
        type="textarea"
        placeholder="What drew you to SAGIE?"
        required
        registration={register('howTheyKnowSagie')}
        error={errors.howTheyKnowSagie?.message}
      />

      <FormField
        label="How did you hear about us?"
        name="referralSource"
        type="select"
        options={[...referralSourceOptions]}
        required
        value={referralSource}
        onValueChange={(v) => setValue('referralSource', v as MembershipFormData['referralSource'], { shouldValidate: true })}
        error={errors.referralSource?.message}
      />

      {showReferralName && (
        <div aria-live="polite">
          <FormField
            label="Who referred you?"
            name="referralName"
            placeholder="Name of the person who referred you"
            registration={register('referralName')}
            error={errors.referralName?.message}
          />
        </div>
      )}
    </div>
  )
}
