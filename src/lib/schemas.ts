import { z } from 'zod';

export const MembershipSchema = z.object({
  fullName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  role: z.string().min(1).max(100).trim(),
  company: z.string().max(100).trim().optional(),
  location: z.string().min(1).max(100).trim(),
  tier: z.enum(['Explorer', 'Builder', 'Shaper']).default('Explorer'),
  linkedIn: z.string().url().optional(),
  whatTheyNeed: z.string().max(500).trim().optional(),
  whatTheyOffer: z.string().max(500).trim().optional(),
  howTheyKnowSagie: z.string().max(500).trim().optional(),
  referral: z.string().max(500).trim().optional(),
  category: z.array(
    z.enum(['Founder', 'Investor', 'Tech Pro', 'Ecosystem Builder', 'Sponsor', 'Partner', 'Advisor'])
  ).optional(),
});

export const ChapterSchema = z.object({
  fullName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  city: z.string().min(1).max(100).trim(),
  whyLead: z.string().min(10).max(2000).trim(),
  linkedIn: z.string().url().optional(),
  communitySize: z.string().max(50).trim().optional(),
  background: z.string().max(2000).trim().optional(),
  chapterVision: z.string().max(2000).trim().optional(),
});

export const VenturesSchema = z.object({
  companyName: z.string().min(1).max(100).trim(),
  founderName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  website: z.string().url().optional(),
  linkedIn: z.string().url().optional(),
  pitchDeckUrl: z.string().url().optional(),
  sector: z.enum(['Fintech', 'AI / ML', 'SaaS', 'Health Tech', 'EdTech', 'Impact / Social', 'Deep Tech', 'Other']).optional(),
  stage: z.enum(['Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Revenue-Stage']).optional(),
  raiseAmount: z.string().max(50).trim().optional(),
  oneLineDescription: z.string().min(1).max(200).trim(),
  whySAGIE: z.string().max(1000).trim().optional(),
});

export const SolutionsSchema = z.object({
  providerName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  category: z.enum(['Operations & Systems', 'Strategy & Advisory', 'Technology & Product', 'Growth & Marketing', 'Finance & Legal', 'Talent & People']),
  bio: z.string().min(10).max(1000).trim(),
  servicesOffered: z.string().min(10).max(1000).trim(),
  linkedIn: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  rateRange: z.string().max(100).trim().optional(),
  location: z.string().max(100).trim().optional(),
});

export const EventSuggestionSchema = z.object({
  eventName: z.string().min(1).max(200).trim(),
  suggestedBy: z.string().min(1).max(100).trim(),
  description: z.string().min(10).max(1000).trim(),
});

export const SubmitPostSchema = z.object({
  postTitle: z.string().min(1).max(200).trim(),
  category: z.string().min(1).max(100).trim(),
  yourName: z.string().min(1).max(100).trim(),
  yourEmail: z.string().email().max(254).trim().toLowerCase(),
  content: z.string().min(10).max(5000).trim(),
  url: z.string().url().optional(),
});
