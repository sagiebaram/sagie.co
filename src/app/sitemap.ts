import type { MetadataRoute } from 'next'
import { SITE } from '@/constants/copy'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
    },
  ]
}
