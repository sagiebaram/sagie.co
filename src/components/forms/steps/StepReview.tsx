'use client'
'use no memo' // react-hook-form's useFormContext().watch() is not compiler-safe

import { useFormContext } from 'react-hook-form'

import type { MembershipFormData } from '@/components/forms/MembershipWizard'
import { PrivacyConsent } from '@/components/ui/PrivacyConsent'

type StepId = 'about-you' | 'location' | 'professional-identity' | 'role-and-needs' | 'tell-us-more'

interface StepReviewProps {
  privacyConsent: boolean
  onPrivacyChange: (checked: boolean) => void
  privacyError: boolean
  onOpenEdit: (stepId: StepId) => void
}

const SECTION_HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  padding: '12px 0',
  borderBottom: '0.5px solid var(--border-default)',
}

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-body)',
  margin: 0,
}

const EDIT_BUTTON_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--silver)',
  cursor: 'pointer',
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-body)',
  padding: '4px 0',
}

const FIELD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  padding: '8px 0',
}

const FIELD_LABEL_STYLE: React.CSSProperties = {
  fontSize: '9px',
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'var(--text-dim)',
  fontFamily: 'var(--font-body)',
}

const FIELD_VALUE_STYLE: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-body)',
  lineHeight: '1.5',
}

function ReviewField({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div style={FIELD_STYLE}>
      <span style={FIELD_LABEL_STYLE}>{label}</span>
      <span style={FIELD_VALUE_STYLE}>{value}</span>
    </div>
  )
}

function ReviewTags({ label, tags }: { label: string; tags: readonly string[] }) {
  if (tags.length === 0) return null
  return (
    <div style={FIELD_STYLE}>
      <span style={FIELD_LABEL_STYLE}>{label}</span>
      <span style={FIELD_VALUE_STYLE}>{tags.join(', ')}</span>
    </div>
  )
}

function SectionHeader({ title, stepId, onEdit }: { title: string; stepId: StepId; onEdit: (id: StepId) => void }) {
  return (
    <div style={SECTION_HEADER_STYLE}>
      <h3 style={SECTION_TITLE_STYLE}>{title}</h3>
      <button type="button" style={EDIT_BUTTON_STYLE} onClick={() => onEdit(stepId)}>
        Edit
      </button>
    </div>
  )
}

export function StepReview({ privacyConsent, onPrivacyChange, privacyError, onOpenEdit }: StepReviewProps) {
  const { watch, setValue } = useFormContext<MembershipFormData>()
  const data = watch()

  const newsletterConsent = data.newsletterConsent ?? false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* About You */}
      <SectionHeader title="About" stepId="about-you" onEdit={onOpenEdit} />
      <ReviewField label="Name" value={data.fullName} />
      <ReviewField label="Email" value={data.email} />
      <ReviewField label="Phone" value={data.phone} />
      <ReviewField label="LinkedIn" value={data.linkedIn} />

      {/* Location */}
      <SectionHeader title="Location" stepId="location" onEdit={onOpenEdit} />
      <ReviewField label="Country" value={data.country} />
      <ReviewField label="State" value={data.state} />
      <ReviewField label="City" value={data.city} />

      {/* Professional Identity */}
      <SectionHeader title="Identity" stepId="professional-identity" onEdit={onOpenEdit} />
      <ReviewTags label="Work Style" tags={data.workStyle ?? []} />
      <ReviewField label="Company" value={data.companyName} />
      <ReviewField label="Organization" value={data.organizationName} />
      <ReviewField label="Freelancer" value={data.freelancerDescription} />

      {/* Role & Needs */}
      <SectionHeader title="Role" stepId="role-and-needs" onEdit={onOpenEdit} />
      <ReviewTags label="I am a..." tags={data.identityTags ?? []} />
      <ReviewTags label="Looking for..." tags={data.needTags ?? []} />
      <ReviewField label="Services offered" value={data.serviceProviderDetail} />

      {/* Tell Us More */}
      <SectionHeader title="More" stepId="tell-us-more" onEdit={onOpenEdit} />
      <ReviewField label="Building / working on" value={data.whatTheyNeed} />
      <ReviewField label="Looking for in community" value={data.communityExpectation} />
      <ReviewField label="Community means" value={data.communityMeaning} />
      <ReviewField label="Why SAGIE" value={data.howTheyKnowSagie} />
      <ReviewField label="Heard about us" value={data.referralSource} />
      <ReviewField label="Referred by" value={data.referralName} />

      {/* Consent checkboxes (ADR §2 Step 6) */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <PrivacyConsent
          checked={privacyConsent}
          onChange={onPrivacyChange}
          error={privacyError}
        />

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={newsletterConsent}
            onChange={(e) => setValue('newsletterConsent', e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              accentColor: 'var(--silver)',
              marginTop: '1px',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              lineHeight: '1.5',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Subscribe to The SAGIE Letter — weekly insights on ecosystem building, startups, and community.
          </span>
        </label>
      </div>
    </div>
  )
}
