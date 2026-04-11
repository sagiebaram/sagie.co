'use client'

import { cn } from '@/lib/utils'

export interface ProgressStep<TId extends string> {
  readonly id: TId
  readonly label: string
}

interface ProgressBarProps<TId extends string> {
  steps: readonly ProgressStep<TId>[]
  currentStep: TId
  completedSteps: ReadonlySet<TId>
  onStepClick: (step: TId) => void
}

/**
 * 6-step progress indicator for the membership wizard.
 * See .planning/ADR-MEMBERSHIP-WIZARD.md §4 + §7.
 *
 * Desktop: labelled circles + connectors.
 * Mobile (< 640px): circles only + "Step N of M" counter and active label.
 * Completed steps are clickable; upcoming steps are disabled.
 */
export function ProgressBar<TId extends string>({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: ProgressBarProps<TId>) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)
  const activeLabel = steps[currentIndex]?.label ?? ''

  return (
    <nav aria-label="Application progress" className="w-full">
      <ol className="flex items-start justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = step.id === currentStep
          const isUpcoming = !isCompleted && !isCurrent
          const isLast = index === steps.length - 1
          const canClick = isCompleted && !isCurrent

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              className="flex flex-1 flex-col items-center min-w-0"
            >
              <div className="flex w-full items-center">
                <button
                  type="button"
                  onClick={() => canClick && onStepClick(step.id)}
                  disabled={!canClick}
                  aria-label={`Step ${index + 1}: ${step.label}${
                    isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ' (upcoming)'
                  }`}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-body transition-colors duration-150',
                    isCompleted && 'border-silver bg-silver text-background cursor-pointer hover:bg-silver-bright',
                    isCurrent && 'border-silver text-silver bg-background',
                    isUpcoming && 'border-border-default text-foreground-dim bg-background cursor-not-allowed',
                  )}
                >
                  {isCompleted ? (
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                    >
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      'h-px flex-1 mx-1 sm:mx-2 transition-colors duration-150',
                      isCompleted ? 'bg-silver' : 'bg-border-default',
                    )}
                  />
                )}
              </div>

              <span
                className={cn(
                  'mt-2 hidden sm:block text-[9px] uppercase tracking-[0.12em] font-body text-center truncate w-full px-1',
                  isCompleted && 'text-foreground-secondary',
                  isCurrent && 'text-silver',
                  isUpcoming && 'text-foreground-dim',
                )}
              >
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>

      {/* Mobile: step counter + current label */}
      <div className="mt-3 sm:hidden text-center">
        <span className="text-[9px] uppercase tracking-[0.12em] text-foreground-muted font-body">
          Step {currentIndex + 1} of {steps.length}
        </span>
        <span className="block mt-1 text-[11px] uppercase tracking-[0.12em] text-silver font-body">
          {activeLabel}
        </span>
      </div>
    </nav>
  )
}
