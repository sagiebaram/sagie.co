import { z } from 'zod';

/** Transform empty strings to undefined so .url().optional() works with blank form fields */
const optionalUrl = (message: string) =>
  z.string().optional().transform((val) => (val === '' ? undefined : val)).pipe(z.string().url(message).optional())

export const MembershipSchema = z.object({
  fullName: z.string().min(1, 'What should we call you?').max(100).trim(),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  role: z.enum(['Founder', 'Investor', 'Operator', 'Ecosystem Builder', 'Academic', 'Partner'], {
    error: 'Please select your role',
  }),
  company: z.string().max(100).trim().optional(),
  location: z.string().min(1, 'Where are you based?').max(100).trim(),
  tier: z.enum(['Explorer', 'Builder', 'Shaper']).default('Explorer'),
  linkedIn: optionalUrl('Please enter a valid LinkedIn URL'),
  whatTheyNeed: z.string().max(500).trim().optional(),
  whatTheyOffer: z.string().max(500).trim().optional(),
  howTheyKnowSagie: z.string().max(500).trim().optional(),
  referral: z.string().max(500).trim().optional(),
  category: z.array(
    z.enum(['Founder', 'Investor', 'Tech Pro', 'Ecosystem Builder', 'Sponsor', 'Partner', 'Advisor'])
  ).optional(),
});

export const ChapterSchema = z.object({
  fullName: z.string().min(1, 'What should we call you?').max(100).trim(),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  city: z.string().min(1, 'Which city would you lead?').max(100).trim(),
  whyLead: z.string().min(10, 'Tell us a bit more about why you want to lead').max(2000).trim(),
  linkedIn: optionalUrl('Please enter a valid URL'),
  communitySize: z.string().max(50).trim().optional(),
  background: z.string().max(2000).trim().optional(),
  chapterVision: z.string().max(2000).trim().optional(),
});

export const VenturesSchema = z.object({
  companyName: z.string().min(1, "What's your company called?").max(100).trim(),
  founderName: z.string().min(1, 'What should we call you?').max(100).trim(),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  website: optionalUrl('Please enter a valid URL'),
  linkedIn: optionalUrl('Please enter a valid LinkedIn URL'),
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
  providerName: z.string().min(1, 'What should we call you?').max(100).trim(),
  email: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  category: z.enum(['Operations & Systems', 'Strategy & Advisory', 'Technology & Product', 'Growth & Marketing', 'Finance & Legal', 'Talent & People'], {
    error: 'Please select a category',
  }),
  bio: z.string().min(10, 'Tell us a bit more about yourself').max(1000).trim(),
  servicesOffered: z.string().min(10, 'Tell us more about what you offer').max(1000).trim(),
  linkedIn: optionalUrl('Please enter a valid URL'),
  portfolioUrl: optionalUrl('Please enter a valid URL'),
  rateRange: z.string().max(100).trim().optional(),
  location: z.string().max(100).trim().optional(),
});

export const EventSuggestionSchema = z.object({
  eventName: z.string().min(1, "What's the event called?").max(200).trim(),
  suggestedBy: z.string().min(1, "Who's suggesting this?").max(100).trim(),
  description: z.string().min(10, 'Tell us more about the event').max(1000).trim(),
});

export const SubmitPostSchema = z.object({
  postTitle: z.string().min(1, 'Give your post a title').max(200).trim(),
  category: z.string().min(1, 'Please select a category').max(100).trim(),
  yourName: z.string().min(1, 'What should we call you?').max(100).trim(),
  yourEmail: z.string().email("That doesn't look like an email address").max(254).trim().toLowerCase(),
  content: z.string().min(10, 'Tell us more — we need at least a few sentences').max(5000).trim(),
  url: optionalUrl('Please enter a valid URL'),
});
