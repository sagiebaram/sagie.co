import { Client } from '@notionhq/client'
import { env } from '@/env/server'

export const notion = new Client({
  auth: env.NOTION_TOKEN,
})
