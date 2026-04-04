import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// --- Shared Patterns ---

const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}'\-\s.]{0,98}[\p{L}\p{M}.]$/u;

const COMPANY_REGEX = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s\-&'.,/()+!#@%]+$/u;

const LINKEDIN_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/(in|company|pub|school)\/[a-zA-Z0-9\-_%.\u00C0-\u017F]+\/?$/i;

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
  city: z.string().min(1, 'Please select or enter a city.').max(100),
}

/** Cascading location validation — state required only for 6 countries (US, AU, CA, BR, MX, IN) */
function locationSuperRefine(data: { country: string; state?: string | undefined; city: string }, ctx: z.RefinementCtx) {
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

// --- Schemas ---

export const MembershipSchema = z.object({
  fullName: nameField('What should we call you?'),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  role: z.string().min(1, 'Please select your role'),
  company: z.string().max(100).trim().optional(),
  ...requiredLocationFields,
  phone: phoneSchema,
  tier: z.enum(['Explorer', 'Builder', 'Shaper']).default('Explorer'),
  linkedIn: optionalLinkedIn(),
  whatTheyNeed: z.string().max(500).trim().optional(),
  whatTheyOffer: z.string().max(500).trim().optional(),
  howTheyKnowSagie: z.string().max(500).trim().optional(),
  referral: z.string().max(500).trim().optional(),
  category: z.array(
    z.enum(['Founder', 'Investor', 'Tech Pro', 'Ecosystem Builder', 'Sponsor', 'Partner', 'Advisor'])
  ).optional(),
}).superRefine((data, ctx) => locationSuperRefine(data, ctx));

export const ChapterSchema = z.object({
  fullName: nameField('What should we call you?'),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  ...requiredLocationFields,
  phone: phoneSchema,
  whyLead: spamCheckedText('Tell us a bit more about why you want to lead'),
  linkedIn: optionalLinkedIn(),
  communitySize: z.string().max(50).trim().optional(),
  background: z.string().max(2000).trim().optional(),
  chapterVision: z.string().max(2000).trim().optional(),
}).superRefine((data, ctx) => locationSuperRefine(data, ctx));

export const VenturesSchema = z.object({
  companyName: companyField("What's your company called?"),
  founderName: nameField('What should we call you?'),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
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
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
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
  description: z.string().min(10, 'Tell us more about the event').max(1000).trim(),
});

export const ContactSchema = z.object({
  name: z.string().min(1, 'What should we call you?').max(100).trim(),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  subject: z.enum(['General Inquiry', 'Partnership', 'Speaking', 'Media', 'Other'], {
    error: 'Please select a subject',
  }),
  message: z.string().min(10, 'Tell us a bit more').max(2000).trim(),
});

export const SubmitPostSchema = z.object({
  postTitle: z.string().min(1, 'Give your post a title').max(200).trim(),
  category: z.string().min(1, 'Please select a category').max(100).trim(),
  yourName: z.string().min(1, 'What should we call you?').max(100).trim(),
  yourEmail: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  content: z.string().min(10, 'Tell us more — we need at least a few sentences').max(5000).trim(),
  url: optionalUrl('Please enter a valid URL'),
});
