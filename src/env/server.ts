import 'server-only';
import { z } from 'zod';

const EnvSchema = z.object({
  NOTION_TOKEN: z.string().min(1),
  NOTION_BLOG_DB_ID: z.string().min(1),
  NOTION_RESOURCES_DB_ID: z.string().min(1),
  NOTION_SOLUTIONS_DB_ID: z.string().min(1),
  NOTION_EVENT_DB_ID: z.string().min(1),
  NOTION_DEAL_PIPELINE_DB_ID: z.string().min(1).optional(),
  NOTION_MEMBER_DB_ID: z.string().min(1),
  NOTION_CHAPTERS_DB_ID: z.string().min(1).optional(),
  NOTION_VENTURES_INTAKE_DB_ID: z.string().min(1),
  ALLOWED_ORIGINS: z.string().min(1),
  REVALIDATE_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email().optional().default('hello@sagie.co'),
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

export const env = EnvSchema.parse(process.env);

export const allowedOrigins = new Set(
  env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
);
