/**
 * Creates the Notion "Contributions" database used by the /contribute form.
 *
 * Idempotent: if NOTION_CONTRIBUTIONS_DB_ID is already set in the environment,
 * the script prints a skip notice and exits 0. Otherwise it creates a new
 * database under NOTION_PARENT_PAGE_ID and prints the resulting ID for the
 * operator to paste into .env.local and Vercel.
 *
 * Schema (matches Sprint 04-11 Track 2 spec):
 *   Name                (title)
 *   Email               (email)
 *   Contribution Types  (multi_select)  — mentorship, collaboration, events, …
 *   Description         (rich_text)
 *   Availability        (select)        — active, growing, occasional, lurking
 *   Status              (select)        — New / In Review / Connected / Closed
 *   Submitted At        (created_time)
 *
 * NOTE: the privacy consent checkbox on the form is a submission precondition
 * (z.literal(true) server-side), not persisted data. There is no Newsletter
 * Consent column and no Privacy Consent column by design.
 *
 * Usage:
 *   NOTION_TOKEN=secret_xxx NOTION_PARENT_PAGE_ID=abc123 \
 *     npx tsx scripts/notion-create-contributions-db.ts
 */

import { Client } from '@notionhq/client'

async function main(): Promise<void> {
  const existing = process.env.NOTION_CONTRIBUTIONS_DB_ID
  if (existing && existing.trim().length > 0) {
    console.log(
      `[notion-create-contributions-db] NOTION_CONTRIBUTIONS_DB_ID already set (${existing}). Skipping create.`
    )
    process.exit(0)
  }

  const token = process.env.NOTION_TOKEN
  if (!token) {
    console.error('[notion-create-contributions-db] Missing NOTION_TOKEN in environment.')
    process.exit(1)
  }

  const parentPageId = process.env.NOTION_PARENT_PAGE_ID
  if (!parentPageId) {
    console.error(
      '[notion-create-contributions-db] Missing NOTION_PARENT_PAGE_ID. ' +
        'Set it to the ID of a Notion page this integration has access to.'
    )
    process.exit(1)
  }

  const notion = new Client({ auth: token })

  console.log('[notion-create-contributions-db] Creating database under parent', parentPageId)

  const result = await notion.databases.create({
    parent: { type: 'page_id', page_id: parentPageId },
    icon: { type: 'emoji', emoji: '🔌' },
    title: [
      {
        type: 'text',
        text: { content: 'Contributions' },
      },
    ],
    properties: {
      Name: { title: {} },
      Email: { email: {} },
      'Contribution Types': {
        multi_select: {
          options: [
            { name: 'Mentorship', color: 'yellow' },
            { name: 'Collaboration', color: 'blue' },
            { name: 'Events', color: 'green' },
            { name: 'Fractional Work', color: 'purple' },
            { name: 'Investment', color: 'orange' },
            { name: 'Resources & Tools', color: 'pink' },
            { name: 'Research', color: 'brown' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      Description: { rich_text: {} },
      Availability: {
        select: {
          options: [
            { name: "Active — I'm all in", color: 'green' },
            { name: 'Growing — learning and exploring', color: 'blue' },
            { name: 'Occasional — show up when I can', color: 'yellow' },
            { name: 'Just looking for now', color: 'gray' },
          ],
        },
      },
      Status: {
        select: {
          options: [
            { name: 'New', color: 'blue' },
            { name: 'In Review', color: 'yellow' },
            { name: 'Connected', color: 'green' },
            { name: 'Closed', color: 'gray' },
          ],
        },
      },
      'Submitted At': { created_time: {} },
    },
  })

  const created = result as { id: string; url?: string }
  console.log('\n[notion-create-contributions-db] ✓ Database created.')
  console.log(`  ID:  ${created.id}`)
  if (created.url) console.log(`  URL: ${created.url}`)
  console.log('\nNext steps:')
  console.log('  1. Add NOTION_CONTRIBUTIONS_DB_ID to .env.local:')
  console.log(`       NOTION_CONTRIBUTIONS_DB_ID=${created.id}`)
  console.log('  2. Add the same value to Vercel (Production, Preview, Development).')
  console.log('  3. Re-run the server so @/env/server picks up the new variable.')
}

main().catch((err) => {
  console.error('[notion-create-contributions-db] failed:', err)
  process.exit(1)
})
