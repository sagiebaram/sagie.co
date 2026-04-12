#!/usr/bin/env npx tsx
/**
 * Notion Members DB Migration — adds 12 new properties for the 6-step wizard.
 *
 * Usage:
 *   npx tsx scripts/notion-migrate-members.ts --dry-run   # preview changes
 *   npx tsx scripts/notion-migrate-members.ts             # apply changes
 *
 * Env:
 *   NOTION_TOKEN         — Notion integration token
 *   NOTION_MEMBER_DB_ID  — Members database ID
 *
 * Idempotent: running twice is safe — existing properties are skipped.
 * ADR: .planning/ADR-MEMBERSHIP-WIZARD.md §5, §9
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Client } from '@notionhq/client'

// Load .env.local if present (for local dev — CI provides env vars directly)
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx)
    const val = trimmed.slice(eqIdx + 1).replace(/^["']|["']$/g, '')
    if (!process.env[key]) {
      process.env[key] = val
    }
  }
} catch {
  // No .env.local — expected in CI
}

// ── Config ──────────────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing env: ${name} is required.`)
    process.exit(1)
  }
  return value
}

const NOTION_TOKEN = requireEnv('NOTION_TOKEN')
const NOTION_MEMBER_DB_ID = requireEnv('NOTION_MEMBER_DB_ID')

const dryRun = process.argv.includes('--dry-run')

const notion = new Client({ auth: NOTION_TOKEN })

// ── Required properties (ADR §9) ───────────────────────────────────────────

type PropertySpec =
  | { type: 'multi_select'; multi_select: { options: { name: string }[] } }
  | { type: 'rich_text'; rich_text: Record<string, never> }
  | { type: 'select'; select: { options: { name: string }[] } }
  | { type: 'checkbox'; checkbox: Record<string, never> }

const REQUIRED_PROPERTIES: Record<string, PropertySpec> = {
  'Work Style': {
    type: 'multi_select',
    multi_select: {
      options: [{ name: 'Company' }, { name: 'Organization' }, { name: 'Freelancer' }],
    },
  },
  'Identity Tags': {
    type: 'multi_select',
    multi_select: {
      options: [
        { name: 'Founder' },
        { name: 'Investor' },
        { name: 'Service Provider' },
        { name: 'Job Seeker' },
        { name: 'Corporate Executive' },
        { name: 'Ecosystem Builder' },
        { name: 'Advisor / Mentor' },
        { name: 'Student / Early Career' },
      ],
    },
  },
  'Need Tags': {
    type: 'multi_select',
    multi_select: {
      options: [
        { name: 'Co-founder' },
        { name: 'Funding' },
        { name: 'Deal flow' },
        { name: 'Talent / Hiring' },
        { name: 'Clients / Customers' },
        { name: 'Mentorship' },
        { name: 'Service providers' },
        { name: 'Community / Network' },
        { name: 'Partnership opportunities' },
        { name: 'A job' },
      ],
    },
  },
  'Service Provider Detail': {
    type: 'rich_text',
    rich_text: {},
  },
  'Company Name': {
    type: 'rich_text',
    rich_text: {},
  },
  'Organization Name': {
    type: 'rich_text',
    rich_text: {},
  },
  'Freelancer Description': {
    type: 'rich_text',
    rich_text: {},
  },
  'Community Expectation': {
    type: 'rich_text',
    rich_text: {},
  },
  'Community Meaning': {
    type: 'rich_text',
    rich_text: {},
  },
  'Referral Source': {
    type: 'select',
    select: {
      options: [
        { name: 'Google Search' },
        { name: 'Social Media' },
        { name: 'Friend or Colleague' },
        { name: 'Event' },
        { name: 'Podcast' },
        { name: 'Article / Blog' },
        { name: 'Referral' },
      ],
    },
  },
  'Referral Name': {
    type: 'rich_text',
    rich_text: {},
  },
  'Newsletter Consent': {
    type: 'checkbox',
    checkbox: {},
  },
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nNotion Members DB Migration`)
  console.log(`Database: ${NOTION_MEMBER_DB_ID}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}\n`)

  // Fetch existing schema
  const db = await notion.databases.retrieve({ database_id: NOTION_MEMBER_DB_ID })
  const existingProps = new Set(Object.keys(db.properties))

  let created = 0
  let skipped = 0
  const toCreate: Record<string, PropertySpec> = {}

  for (const [name, spec] of Object.entries(REQUIRED_PROPERTIES)) {
    if (existingProps.has(name)) {
      console.log(`  SKIP (exists): ${name}`)
      skipped++
    } else {
      console.log(`  ${dryRun ? 'WOULD CREATE' : 'CREATE'}: ${name} (${spec.type})`)
      toCreate[name] = spec
      created++
    }
  }

  if (created === 0) {
    console.log(`\nAll 12 properties already exist. Nothing to do.`)
    return
  }

  if (dryRun) {
    console.log(`\n--- DRY RUN SUMMARY ---`)
    console.log(`Would create: ${created} | Already exist: ${skipped}`)
    console.log(`Run without --dry-run to apply.\n`)
    return
  }

  // Apply: batch all new properties in a single databases.update call
  await notion.databases.update({
    database_id: NOTION_MEMBER_DB_ID,
    properties: toCreate,
  })

  console.log(`\n--- SUMMARY ---`)
  console.log(`Created: ${created} | Skipped (exists): ${skipped}\n`)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
