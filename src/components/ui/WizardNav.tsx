'use client'

import { cn } from '@/lib/utils'

interface WizardNavProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting?: boolean | undefined
  nextDisabled?: boolean | undefined
}

/**
 * Back / Next / Submit button row for the membership wizard.
 * See .planning/ADR-MEMBERSHIP-WIZARD.md §1 + §3.
 *
 * - `currentStep` is 1-indexed.
 * - Back is hidden on step 1.
 * - Submit replaces Next on the final step.
 * - Buttons are real <button> elements (not the <a>-based shared Button) so
 *   they can be wired to real click + form submit semantics inside the wizard.
 */
export function WizardNav({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
  nextDisabled = false,
}: WizardNavProps) {
  const isFirstStep = currentStep <= 1
  const isLastStep = currentStep >= totalSteps

  const baseStyles =
    'inline-flex items-center justify-center font-body uppercase text-[13px] tracking-[0.14em] px-[28px] py-3 transition-all duration-150 disabled:cursor-not-allowed'

  return (
    <div className="flex items-center justify-between gap-4 mt-8">
      <div>
        {!isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className={cn(
              baseStyles,
              'text-foreground-muted hover:text-silver border-b border-border-default disabled:opacity-50',
            )}
          >
            ← Back
          </button>
        )}
      </div>

      <div>
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || nextDisabled}
            className={cn(
              baseStyles,
              'bg-silver text-background hover:bg-silver-bright disabled:opacity-50 hover:-translate-y-px',
            )}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Application →'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting || nextDisabled}
            className={cn(
              baseStyles,
              'bg-silver text-background hover:bg-silver-bright disabled:opacity-50 hover:-translate-y-px',
            )}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
