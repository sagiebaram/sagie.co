'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryState, parseAsStringLiteral } from 'nuqs'
import type { z } from 'zod'

import { MembershipSchema } from '@/lib/schemas'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { WizardNav } from '@/components/ui/WizardNav'
import { StepEditModal } from '@/components/ui/StepEditModal'
import { StepAboutYou } from '@/components/forms/steps/StepAboutYou'
import { StepLocation } from '@/components/forms/steps/StepLocation'
import { StepProfessionalIdentity } from '@/components/forms/steps/StepProfessionalIdentity'
import { StepRoleAndNeeds } from '@/components/forms/steps/StepRoleAndNeeds'
import { StepTellUsMore } from '@/components/forms/steps/StepTellUsMore'
import { StepReview } from '@/components/forms/steps/StepReview'

// --- Step definitions (ADR §2, §4, §6) ---

const STEPS = [
  'about-you',
  'location',
  'professional-identity',
  'role-and-needs',
  'tell-us-more',
  'review',
] as const

type StepId = (typeof STEPS)[number]

const STEP_LABELS: Record<StepId, string> = {
  'about-you': 'About',
  'location': 'Location',
  'professional-identity': 'Identity',
  'role-and-needs': 'Role',
  'tell-us-more': 'More',
  'review': 'Review',
}

const PROGRESS_STEPS = STEPS.map((id) => ({ id, label: STEP_LABELS[id] }))

// ADR §3 — fields validated per step via trigger()
const STEP_FIELDS: Record<StepId, (keyof MembershipFormData)[]> = {
  'about-you': ['fullName', 'email', 'phone', 'linkedIn'],
  'location': ['country', 'state', 'city'],
  'professional-identity': ['workStyle', 'companyName', 'organizationName', 'freelancerDescription'],
  'role-and-needs': ['identityTags', 'needTags', 'serviceProviderDetail'],
  'tell-us-more': ['whatTheyNeed', 'communityExpectation', 'communityMeaning', 'howTheyKnowSagie', 'referralSource', 'referralName'],
  'review': [],
}

export type MembershipFormData = z.input<typeof MembershipSchema>

const STORAGE_KEY = 'membership-draft'
const STORAGE_EXPIRY_MS = 86_400_000 // 24 hours

export function MembershipWizard() {
  const trapRef = useRef('')
  const loadTime = useRef(0)
  useEffect(() => { loadTime.current = Date.now() }, [])

  const formRef = useRef<HTMLDivElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [step, setStep] = useQueryState(
    'step',
    parseAsStringLiteral(STEPS)
      .withDefault('about-you')
      .withOptions({ history: 'push', shallow: true }),
  )

  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set())
  const [fadeClass, setFadeClass] = useState('wizard-step-active')
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [privacyError, setPrivacyError] = useState(false)

  // Edit modal state
  const [editingStep, setEditingStep] = useState<StepId | null>(null)

  const methods = useForm<MembershipFormData>({
    resolver: zodResolver(MembershipSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      linkedIn: '',
      country: '',
      state: '',
      city: '',
      workStyle: [],
      companyName: '',
      organizationName: '',
      freelancerDescription: '',
      identityTags: [],
      needTags: [],
      serviceProviderDetail: '',
      whatTheyNeed: '',
      communityExpectation: '',
      communityMeaning: '',
      howTheyKnowSagie: '',
      referralSource: '' as unknown as MembershipFormData['referralSource'],
      referralName: '',
      newsletterConsent: false,
      tier: 'Explorer',
    },
  })

  const { trigger, watch, reset, formState: { isSubmitting } } = methods

  // --- sessionStorage: silent restore on mount (ADR §8) ---
  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const saved = JSON.parse(raw) as Record<string, unknown>
      const savedAt = saved._savedAt as number | undefined
      if (savedAt && Date.now() - savedAt > STORAGE_EXPIRY_MS) {
        sessionStorage.removeItem(STORAGE_KEY)
        return
      }
      const { _savedAt: _, ...formData } = saved
      reset(formData as MembershipFormData, { keepDefaultValues: false })
    } catch {
      /* ignore corrupt data */
    }
  }, [reset])

  // --- sessionStorage: debounced save on change (ADR §8) ---
  useEffect(() => {
    const subscription = watch((values) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...values, _savedAt: Date.now() }),
        )
      }, 500)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // --- Focus management (ADR §7) ---
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const firstInput = formRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), select, textarea, [role="combobox"], [role="checkbox"]',
      )
      firstInput?.focus()
    })
    return () => cancelAnimationFrame(rafId)
  }, [step])

  // --- Fade transition (ADR §1) ---
  const transitionToStep = useCallback((nextStep: StepId) => {
    setFadeClass('wizard-step-enter')
    setStep(nextStep)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFadeClass('wizard-step-active')
      })
    })
  }, [setStep])

  // --- Navigation ---
  const stepIndex = STEPS.indexOf(step)

  const handleNext = useCallback(async () => {
    const fields = STEP_FIELDS[step]
    const valid = await trigger(fields)
    if (!valid) return

    setCompletedSteps((prev) => new Set(prev).add(step))
    const nextStep = STEPS[stepIndex + 1]
    if (nextStep) transitionToStep(nextStep)
  }, [step, stepIndex, trigger, transitionToStep])

  const handleBack = useCallback(() => {
    const prevStep = STEPS[stepIndex - 1]
    if (prevStep) transitionToStep(prevStep)
  }, [stepIndex, transitionToStep])

  const handleStepClick = useCallback((clickedStep: StepId) => {
    if (completedSteps.has(clickedStep)) {
      transitionToStep(clickedStep)
    }
  }, [completedSteps, transitionToStep])

  // --- Submission (ADR §5) ---
  const handleSubmit = useCallback(async () => {
    if (isRateLimited) return
    if (!privacyConsent) {
      setPrivacyError(true)
      return
    }
    setPrivacyError(false)
    setSubmitError(null)

    const valid = await trigger()
    if (!valid) return

    const data = methods.getValues()
    try {
      const res = await fetch('/api/applications/membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          privacyConsent,
          _trap: trapRef.current,
          _t: loadTime.current,
        }),
      })

      if (res.status === 429) {
        setIsRateLimited(true)
        setSubmitError('Too many submissions. Please try again later.')
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string }
        setSubmitError(body.error ?? 'Something went wrong. Please try again.')
        return
      }

      sessionStorage.removeItem(STORAGE_KEY)
      setSuccess(true)
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
    }
  }, [isRateLimited, privacyConsent, trigger, methods])

  // --- Edit modal handlers ---
  const handleOpenEdit = useCallback((stepId: StepId) => {
    setEditingStep(stepId)
  }, [])

  const handleCloseEdit = useCallback(() => {
    setEditingStep(null)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (!editingStep) return
    const fields = STEP_FIELDS[editingStep]
    const valid = await trigger(fields)
    if (valid) setEditingStep(null)
  }, [editingStep, trigger])

  // --- Success state ---
  if (success) {
    return (
      <div className="border border-border-default bg-background-card px-8 py-12 text-center">
        <p className="font-body uppercase text-[11px] tracking-[0.14em] text-silver mb-4">
          Application Submitted
        </p>
        <p className="font-body text-foreground-secondary text-body leading-[1.7] max-w-[420px] mx-auto">
          Thank you for applying to SAGIE ECO. We review every application personally
          and will be in touch soon.
        </p>
      </div>
    )
  }

  const currentStepContent = (() => {
    switch (step) {
      case 'about-you':
        return <StepAboutYou />
      case 'location':
        return <StepLocation />
      case 'professional-identity':
        return <StepProfessionalIdentity />
      case 'role-and-needs':
        return <StepRoleAndNeeds />
      case 'tell-us-more':
        return <StepTellUsMore />
      case 'review':
        return (
          <StepReview
            privacyConsent={privacyConsent}
            onPrivacyChange={setPrivacyConsent}
            privacyError={privacyError}
            onOpenEdit={handleOpenEdit}
          />
        )
      default:
        return null
    }
  })()

  const editStepContent = (() => {
    if (!editingStep) return null
    switch (editingStep) {
      case 'about-you':
        return <StepAboutYou />
      case 'location':
        return <StepLocation />
      case 'professional-identity':
        return <StepProfessionalIdentity />
      case 'role-and-needs':
        return <StepRoleAndNeeds />
      case 'tell-us-more':
        return <StepTellUsMore />
      default:
        return null
    }
  })()

  return (
    <div ref={formRef}>
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trapRef.current}
          onChange={(e) => { trapRef.current = e.target.value }}
        />
      </div>

      <ProgressBar
        steps={PROGRESS_STEPS}
        currentStep={step}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Screen reader announcement (ADR §7) */}
      <div aria-live="polite" className="sr-only">
        Step {stepIndex + 1} of {STEPS.length}: {STEP_LABELS[step]}
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          className="mt-8"
        >
          <fieldset className="border-0 p-0 m-0">
            <legend className="sr-only">{STEP_LABELS[step]}</legend>
            <div className={fadeClass}>
              {currentStepContent}
            </div>
          </fieldset>

          {submitError && (
            <div className="mt-4 text-[11px] font-body" style={{ color: 'var(--color-error)' }}>
              {submitError}
            </div>
          )}

          <WizardNav
            currentStep={stepIndex + 1}
            totalSteps={STEPS.length}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </form>

        {/* Edit modal (ADR §7) */}
        <StepEditModal
          isOpen={editingStep !== null}
          onClose={handleCloseEdit}
          stepId={editingStep ?? ''}
          stepLabel={editingStep ? STEP_LABELS[editingStep] : ''}
        >
          {editStepContent}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="inline-flex items-center justify-center font-body uppercase text-[13px] tracking-[0.14em] px-[28px] py-3 bg-silver text-background hover:bg-silver-bright transition-all duration-150"
            >
              Save
            </button>
          </div>
        </StepEditModal>
      </FormProvider>
    </div>
  )
}
