import 'server-only'
import { notion } from '@/lib/notion'
import { notionWrite } from '@/lib/notion-monitor'
import { env } from '@/env/server'
import { CONTRIBUTION_TYPE_LABELS, AVAILABILITY_LABELS } from '@/constants/contribute'

export interface ContributeRecord {
  name: string
  email: string
  contributionTypes: readonly string[]
  description?: string | undefined
  availability: string
  // `consent` is intentionally excluded — it is a submission precondition,
  // not persisted data. See Sprint 04-11 Track 2 spec.
}

/**
 * Writes a contribute-form submission to the Notion Contributions database.
 *
 * The database is created by scripts/notion-create-contributions-db.ts and
 * its ID is supplied via NOTION_CONTRIBUTIONS_DB_ID (marked optional in
 * src/env/server.ts so the app still boots in dev without it).
 *
 * If the DB ID is missing, this is a no-op that logs a warning — the API
 * route will still send confirmation emails and return 200, matching the
 * existing "bypassed for testing" pattern used by the membership route.
 */
export async function writeContributionToNotion(record: ContributeRecord): Promise<void> {
  const dbId = env.NOTION_CONTRIBUTIONS_DB_ID
  if (!dbId) {
    console.warn(
      '[contributions] NOTION_CONTRIBUTIONS_DB_ID not set — skipping Notion write. ' +
        'Run scripts/notion-create-contributions-db.ts to create the database.'
    )
    return
  }

  const contributionTypeNames = record.contributionTypes.map((value) => ({
    name: CONTRIBUTION_TYPE_LABELS[value] ?? value,
  }))

  const availabilityLabel =
    AVAILABILITY_LABELS[record.availability] ?? record.availability

  await notionWrite(() =>
    notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: record.name } }] },
        Email: { email: record.email },
        'Contribution Types': { multi_select: contributionTypeNames },
        Availability: { select: { name: availabilityLabel } },
        Status: { select: { name: 'New' } },
        ...(record.description
          ? {
              Description: {
                rich_text: [{ text: { content: record.description } }],
              },
            }
          : {}),
      },
    })
  )
}
