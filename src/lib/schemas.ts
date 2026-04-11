import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// --- Shared Patterns ---

const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}'\-\s.]{0,98}[\p{L}\p{M}.]$/u;

const COMPANY_REGEX = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s\-&'.,/()+!#@%]+$/u;

const LINKEDIN_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/(in|company|pub|school)\/[a-zA-Z0-9\-_%.\u00C0-\u017F]+\/?$/i;

/** Production-grade email validation — covers RFC 5321 limits and common formatting traps */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, 'Email is too short.')
  .max(254, 'Email is too long.')
  .email('Please enter a valid email address.')
  .refine(
    (val) => {
      const parts = val.split('@');
      const local = parts[0] ?? '';
      const domain = parts[1] ?? '';
      return (
        local.length <= 64 &&
        !local.startsWith('.') &&
        !local.endsWith('.') &&
        !local.includes('..') &&
        domain.length > 0 &&
        !domain.startsWith('.') &&
        !domain.endsWith('.') &&
        !domain.includes('..')
      );
    },
    'Email address format is invalid.',
  )
  .refine(
    (val) => {
      const domain = val.split('@')[1] ?? '';
      return /^[^\s@]+\.[a-z]{2,63}$/i.test(domain);
    },
    'Email domain appears invalid.',
  );

/** Transform empty strings to undefined so .url().optional() works with blank form fields */
const optionalUrl = (message: string) =>
  z.string().optional().transform((val) => (val === '' ? undefined : val)).pipe(z.string().url(message).optional())

/** Optional LinkedIn URL — validates domain + path structure */
const optionalLinkedIn = () =>
  z.string().optional().transform((val) => (val === '' ? undefined : val)).pipe(
    z.string().url('Please enter a valid URL.')
      .regex(LINKEDIN_REGEX, 'Must be a LinkedIn profile or company URL.')
      .optional()
  )

/** Name field — Unicode-aware, supports all scripts */
const nameField = (message: string) =>
  z.string().min(1, message).max(100).trim()
    .regex(NAME_REGEX, 'Name can include letters (any script), hyphens, apostrophes, spaces, and periods.')

/** Company name — numbers, &, punctuation, corporate suffixes allowed */
const companyField = (message: string) =>
  z.string().min(1, message).max(200).trim()
    .regex(COMPANY_REGEX, 'Company name contains unsupported characters.')

/** Phone number — validates with libphonenumber-js, normalizes to E.164 */
export const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Phone number is too short.')
  .transform((val, ctx) => {
    const phone = parsePhoneNumberFromString(val, { extract: false });
    if (phone?.isValid()) {
      return phone.format('E.164');
    }
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Enter a valid phone number (e.g. +1 555 123 4567).',
    });
    return z.NEVER;
  });

/** Optional phone — empty string becomes undefined */
const optionalPhone = () =>
  z.string().optional().transform((val) => (val === '' ? undefined : val)).pipe(
    phoneSchema.optional()
  )

/** Text field with spam heuristics */
const spamCheckedText = (minMsg: string, min = 10, max = 2000) =>
  z.string().min(min, minMsg).max(max, `Max ${max} characters.`).trim()
    .refine(
      (val) => !/(.)\1{9,}/.test(val),
      'Looks like repeated characters — please write a real answer.'
    )
    .refine(
      (val) => (val.match(/https?:\/\//gi) ?? []).length <= 2,
      'Too many links — please keep URLs minimal.'
    )
    .refine(
      (val) => (val.match(/[A-Z]/g) ?? []).length / val.length < 0.7,
      'Please avoid excessive caps.'
    )

// --- Location validation (uses country-state-city library) ---

import { Country, State } from 'country-state-city'
import { COUNTRIES_WITH_STATE_FIELD } from '@/lib/locationData'

/** Location fields for required forms (Membership, Chapter) — validates country→state→city cascade */
const requiredLocationFields = {
  country: z.string().min(2, 'Please select a country.'),
  state: z.string().optional(),
  city: z.string().min(1, 'Please select or enter a city.').max(100).trim(),
}

/** Cascading location validation — state required only for 6 countries (US, AU, CA, BR, MX, IN) */
export function locationSuperRefine(data: { country: string; state?: string | undefined; city: string }, ctx: z.RefinementCtx) {
  if (!Country.getCountryByCode(data.country)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid country.', path: ['country'] })
    return
  }
  if (COUNTRIES_WITH_STATE_FIELD.has(data.country)) {
    const countryStates = State.getStatesOfCountry(data.country)
    if (!data.state) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select a state/province.', path: ['state'] })
      return
    }
    if (!countryStates.some((s) => s.isoCode === data.state)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'State does not belong to this country.', path: ['state'] })
      return
    }
  }
}

/** Optional location fields for secondary forms (Ventures, Solutions) */
const optionalLocationFields = {
  country: z.string().max(100).trim().optional(),
  state: z.string().max(100).trim().optional(),
  city: z.string().max(100).trim().optional(),
}

// --- Membership Wizard Schemas ---
//
// The membership form is a 6-step wizard (see .planning/ADR-MEMBERSHIP-WIZARD.md).
// Each step exports its own schema for `trigger()`-based step validation, and
// the final `MembershipSchema` composes every field + refinement for submit.

/** Step 3: Professional identity — how the applicant works */
export const workStyleOptions = ['Company', 'Organization', 'Freelancer'] as const

/** Step 4: "I am a..." identity tags — the supply side of matchmaking */
export const identityTagOptions = [
  'Founder',
  'Investor',
  'Service Provider',
  'Job Seeker',
  'Corporate Executive',
  'Ecosystem Builder',
  'Advisor / Mentor',
  'Student / Early Career',
] as const

/** Step 4: "I'm looking for..." need tags — the demand side of matchmaking */
export const needTagOptions = [
  'Co-founder',
  'Funding',
  'Deal flow',
  'Talent / Hiring',
  'Clients / Customers',
  'Mentorship',
  'Service providers',
  'Community / Network',
  'Partnership opportunities',
  'A job',
] as const

/** Step 5: Referral source dropdown options */
export const referralSourceOptions = [
  'Google Search',
  'Social Media',
  'Friend or Colleague',
  'Event',
  'Podcast',
  'Article / Blog',
  'Referral',
] as const

export type WorkStyle = (typeof workStyleOptions)[number]
export type IdentityTag = (typeof identityTagOptions)[number]
export type NeedTag = (typeof needTagOptions)[number]
export type ReferralSource = (typeof referralSourceOptions)[number]

// Base object holding every membership field. Per-step schemas `pick()` from
// this, and the final `MembershipSchema` layers all superRefines on top.
const membershipBase = z.object({
  // Step 1: About You
  fullName: nameField('What should we call you?'),
  email: emailSchema,
  phone: phoneSchema,
  linkedIn: optionalLinkedIn(),

  // Step 2: Location
  ...requiredLocationFields,

  // Step 3: Professional identity
  workStyle: z.array(z.enum(workStyleOptions)).min(1, 'Select at least one'),
  companyName: z.string().max(200).trim().optional(),
  organizationName: z.string().max(200).trim().optional(),
  freelancerDescription: z.string().max(200).trim().optional(),

  // Step 4: Role & needs (matchmaking)
  identityTags: z.array(z.enum(identityTagOptions)).min(1, 'Select at least one'),
  needTags: z.array(z.enum(needTagOptions)).min(1, 'Select at least one'),
  serviceProviderDetail: z.string().max(500).trim().optional(),

  // Step 5: Tell us more
  whatTheyNeed: spamCheckedText("Tell us what you're working on."),
  communityExpectation: spamCheckedText("Tell us what you're looking for."),
  communityMeaning: spamCheckedText('Tell us what community means to you.'),
  howTheyKnowSagie: spamCheckedText('Tell us why SAGIE.'),
  referralSource: z.enum(referralSourceOptions, { error: 'Please select how you heard about us.' }),
  referralName: z.string().max(100).trim().optional(),

  // Step 6: Consent + hidden defaults
  // NOTE: privacyConsent is managed outside react-hook-form (existing pattern)
  newsletterConsent: z.boolean().default(false),
  tier: z.literal('Explorer').default('Explorer'),
})

/** Step 3 refinement: each selected work style requires its companion text field */
function professionalIdentitySuperRefine(
  data: {
    workStyle: readonly WorkStyle[]
    companyName?: string | undefined
    organizationName?: string | undefined
    freelancerDescription?: string | undefined
  },
  ctx: z.RefinementCtx,
) {
  if (data.workStyle.includes('Company') && !data.companyName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter your company name.',
      path: ['companyName'],
    })
  }
  if (data.workStyle.includes('Organization') && !data.organizationName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please enter your organization name.',
      path: ['organizationName'],
    })
  }
  if (data.workStyle.includes('Freelancer') && !data.freelancerDescription?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please describe what you do.',
      path: ['freelancerDescription'],
    })
  }
}

/** Step 4 refinement: Service Provider identity tag requires a detail field */
function roleAndNeedsSuperRefine(
  data: { identityTags: readonly IdentityTag[]; serviceProviderDetail?: string | undefined },
  ctx: z.RefinementCtx,
) {
  if (data.identityTags.includes('Service Provider') && !data.serviceProviderDetail?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please describe what you offer.',
      path: ['serviceProviderDetail'],
    })
  }
}

/** Step 5 refinement: Referral source "Referral" requires a name */
function tellUsMoreSuperRefine(
  data: { referralSource: ReferralSource; referralName?: string | undefined },
  ctx: z.RefinementCtx,
) {
  if (data.referralSource === 'Referral' && !data.referralName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please tell us who referred you.',
      path: ['referralName'],
    })
  }
}

// ── Per-step schemas (used by `trigger()` for step-level validation) ──────────

export const StepAboutYouSchema = membershipBase.pick({
  fullName: true,
  email: true,
  phone: true,
  linkedIn: true,
})

export const StepLocationSchema = membershipBase
  .pick({ country: true, state: true, city: true })
  .superRefine((data, ctx) => locationSuperRefine(data, ctx))

export const StepProfessionalIdentitySchema = membershipBase
  .pick({
    workStyle: true,
    companyName: true,
    organizationName: true,
    freelancerDescription: true,
  })
  .superRefine((data, ctx) => professionalIdentitySuperRefine(data, ctx))

export const StepRoleAndNeedsSchema = membershipBase
  .pick({
    identityTags: true,
    needTags: true,
    serviceProviderDetail: true,
  })
  .superRefine((data, ctx) => roleAndNeedsSuperRefine(data, ctx))

export const StepTellUsMoreSchema = membershipBase
  .pick({
    whatTheyNeed: true,
    communityExpectation: true,
    communityMeaning: true,
    howTheyKnowSagie: true,
    referralSource: true,
    referralName: true,
  })
  .superRefine((data, ctx) => tellUsMoreSuperRefine(data, ctx))

// ── Full schema: every field + every refinement, validated on submit ──────────

export const MembershipSchema = membershipBase
  .superRefine((data, ctx) => locationSuperRefine(data, ctx))
  .superRefine((data, ctx) => professionalIdentitySuperRefine(data, ctx))
  .superRefine((data, ctx) => roleAndNeedsSuperRefine(data, ctx))
  .superRefine((data, ctx) => tellUsMoreSuperRefine(data, ctx))

export const ChapterSchema = z.object({
  fullName: nameField('What should we call you?'),
  email: emailSchema,
  ...requiredLocationFields,
  phone: phoneSchema,
  whyLead: spamCheckedText('Tell us a bit more about why you want to lead'),
  linkedIn: optionalLinkedIn(),
  communitySize: z.string().max(50).trim().optional(),
  background: z.string().max(2000).trim().optional(),
  chapterVision: z.string().max(2000).trim().optional(),
}).superRefine((data, ctx) => locationSuperRefine(data, ctx));

export const VenturesSchema = z.object({
  ventureType: z.enum(['founder', 'investor']),
  companyName: companyField("What's your company called?"),
  founderName: nameField('What should we call you?'),
  email: emailSchema,
  ...optionalLocationFields,
  phone: phoneSchema,
  website: optionalUrl('Please enter a valid URL'),
  linkedIn: optionalLinkedIn(),
  pitchDeckUrl: optionalUrl('Please enter a valid URL'),
  sector: z.enum(['Fintech', 'AI / ML', 'SaaS', 'Health Tech', 'EdTech', 'Impact / Social', 'Deep Tech', 'Other'], {
    error: 'Please select a sector',
  }).optional(),
  stage: z.enum(['Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Revenue-Stage'], {
    error: 'Please select your stage',
  }).optional(),
  raiseAmount: z.string().max(50).trim().optional(),
  oneLineDescription: z.string().min(1, 'Give us the elevator pitch').max(200).trim(),
  whySAGIE: z.string().max(1000).trim().optional(),
});

export const SolutionsSchema = z.object({
  providerName: nameField('What should we call you?'),
  email: emailSchema,
  ...optionalLocationFields,
  phone: phoneSchema,
  category: z.enum(['Operations & Systems', 'Strategy & Advisory', 'Technology & Product', 'Growth & Marketing', 'Finance & Legal', 'Talent & People'], {
    error: 'Please select a category',
  }),
  bio: spamCheckedText('Tell us a bit more about yourself', 10, 1000),
  servicesOffered: spamCheckedText('Tell us more about what you offer', 10, 1000),
  linkedIn: optionalLinkedIn(),
  portfolioUrl: optionalUrl('Please enter a valid URL'),
  rateRange: z.string().max(100).trim().optional(),
});

export const EventSuggestionSchema = z.object({
  eventName: z.string().min(1, "What's the event called?").max(200).trim(),
  suggestedBy: z.string().min(1, "Who's suggesting this?").max(100).trim(),
  email: emailSchema,
  description: z.string().min(10, 'Tell us more about the event').max(1000).trim(),
});

export const ContactSchema = z.object({
  name: z.string().min(1, 'What should we call you?').max(100).trim(),
  email: emailSchema,
  subject: z.enum(['General Inquiry', 'Partnership', 'Speaking', 'Media', 'Other'], {
    error: 'Please select a subject',
  }),
  message: z.string().min(10, 'Tell us a bit more').max(2000).trim(),
});

export const SubscribeSchema = z.object({
  email: emailSchema,
});

export const SubmitPostSchema = z.object({
  postTitle: z.string().min(1, 'Give your post a title').max(200).trim(),
  category: z.string().min(1, 'Please select a category').max(100).trim(),
  yourName: z.string().min(1, 'What should we call you?').max(100).trim(),
  yourEmail: emailSchema,
  content: z.string().min(10, 'Tell us more — we need at least a few sentences').max(5000).trim(),
  url: optionalUrl('Please enter a valid URL'),
});
