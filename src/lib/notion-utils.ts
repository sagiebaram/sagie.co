import * as Sentry from '@sentry/nextjs'

 
type NotionProperties = Record<string, any>

function warnMissing(pageId: string, propName: string): void {
  const msg = `Notion property "${propName}" missing on page ${pageId}`
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(msg, 'warning')
  } else {
    console.warn(msg)
  }
}

export function getTextProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback = ''
): string {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
  return prop.rich_text?.[0]?.plain_text ?? fallback
}

export function getTitleProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback = ''
): string {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
  return prop.title?.[0]?.plain_text ?? fallback
}

export function getSelectProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback = ''
): string {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
  return prop.select?.name ?? fallback
}

export function getNumberProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback: number | null = null
): number | null {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
  return prop.number ?? fallback
}

export function getCheckboxProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback = false
): boolean {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
  return prop.checkbox ?? fallback
}

export function getUrlProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback: string | null = null
): string | null {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
  return prop.url ?? fallback
}

export function getDateProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback: string | null = null
): string | null {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
  return prop.date?.start ?? fallback
}

export function getFullTextProperty(
  properties: NotionProperties,
  propName: string,
  pageId: string,
  fallback: string | null = null
): string | null {
  const prop = properties[propName]
  if (!prop) { warnMissing(pageId, propName); return fallback }
   
  const text = prop.rich_text?.map((b: any) => b.plain_text).join('')
  return text || fallback
}
