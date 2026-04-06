import type { CityData } from '@/lib/members'

/** A point rendered on the globe (member city or chapter pin) */
export interface GlobePoint extends CityData {
  isChapterPin?: boolean
  chapterStatus?: string
}

/** Arc connecting two points on the globe */
export interface GlobeArc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
}

/** Ring animation data for active chapters */
export interface GlobeRing {
  lat: number
  lng: number
  maxR: number
  propagationSpeed: number
  repeatPeriod: number
}

/** GeoJSON feature collection for country polygons */
export interface GeoJsonFeatureCollection {
  features: GeoJsonFeature[]
}

export interface GeoJsonFeature {
  type: string
  properties: Record<string, unknown>
  geometry: {
    type: string
    coordinates: unknown
  }
}
