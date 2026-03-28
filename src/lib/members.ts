import 'server-only'
import { unstable_cache } from 'next/cache'
import { notion } from './notion'
import { env } from '@/env/server'

export interface CityData {
  id: string
  name: string
  lat: number
  lng: number
  members: number
  isChapter: boolean
}

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'miami': { lat: 25.7617, lng: -80.1918 },
  'new york': { lat: 40.7128, lng: -74.006 },
  'dallas': { lat: 32.7767, lng: -96.797 },
  'tel aviv': { lat: 32.0853, lng: 34.7818 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'boston': { lat: 42.3601, lng: -71.0589 },
}

// Canonical display names keyed by lowercase city name
const CITY_DISPLAY_NAMES: Record<string, string> = {
  'miami': 'Miami',
  'new york': 'New York',
  'dallas': 'Dallas',
  'tel aviv': 'Tel Aviv',
  'singapore': 'Singapore',
  'dubai': 'Dubai',
  'london': 'London',
  'los angeles': 'Los Angeles',
  'san francisco': 'San Francisco',
  'chicago': 'Chicago',
  'austin': 'Austin',
  'boston': 'Boston',
}

export const getMemberCities = unstable_cache(
  async (): Promise<CityData[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await notion.databases.query({
      database_id: env.NOTION_MEMBER_DB_ID,
      filter: {
        property: 'Status',
        select: { does_not_equal: 'Rejected' },
      },
    })

    // Aggregate member counts by lowercase city name
    const counts: Record<string, number> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const page of response.results as any[]) {
      const rawLocation: string | undefined =
        page.properties?.['Location']?.select?.name
      if (!rawLocation) continue
      const key = rawLocation.toLowerCase()
      if (!(key in CITY_COORDS)) continue
      counts[key] = (counts[key] ?? 0) + 1
    }

    return Object.entries(counts).map(([key, memberCount]) => {
      const coords = CITY_COORDS[key]!
      return {
        id: key.replace(/\s+/g, '-'),
        name: CITY_DISPLAY_NAMES[key] ?? key,
        lat: coords.lat,
        lng: coords.lng,
        members: memberCount,
        isChapter: false, // cross-referencing with chapters happens in GlobeShell
      }
    })
  },
  ['notion:members:cities'],
  { revalidate: 3600, tags: ['notion:members'] }
)
