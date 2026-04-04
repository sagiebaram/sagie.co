/**
 * Curated city lists for countries/states with SAGIE presence or high applicant volume.
 * Used instead of the country-state-city library data for these specific locations.
 *
 * Structure: { groupLabel: string; cities: string[] }[]
 * "Other" is always appended as the last item in the last group by the component.
 */

export interface CityGroup {
  label: string
  cities: string[]
}

// --- Countries that show the state/province field ---

export const COUNTRIES_WITH_STATE_FIELD = new Set(['US', 'AU', 'CA', 'BR', 'MX', 'IN'])

// --- US curated cities by state ---

export const US_STATE_CITIES: Record<string, CityGroup[]> = {
  FL: [
    { label: 'South Florida', cities: ['Miami', 'Miami Beach', 'Fort Lauderdale', 'Boca Raton', 'West Palm Beach'] },
    { label: 'Greater Florida', cities: ['Orlando', 'Tampa', 'Jacksonville'] },
  ],
  NY: [
    { label: 'NYC Boroughs', cities: ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island'] },
    { label: 'Greater New York', cities: ['Long Island', 'Westchester', 'Jersey City', 'Hoboken'] },
  ],
  CA: [
    { label: 'Bay Area', cities: ['San Francisco', 'San Jose', 'Oakland', 'Silicon Valley'] },
    { label: 'Southern California', cities: ['Los Angeles', 'San Diego', 'Orange County'] },
    { label: 'Other California', cities: ['Sacramento'] },
  ],
  TX: [
    { label: 'Major Cities', cities: ['Austin', 'Dallas', 'Houston', 'San Antonio'] },
    { label: 'Other Texas', cities: ['Fort Worth', 'El Paso'] },
  ],
}

// --- Country-level curated cities (no state field) ---

export const COUNTRY_CITIES: Record<string, CityGroup[]> = {
  IL: [
    { label: 'Israel', cities: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva', 'Ashdod', 'Herzliya'] },
  ],
  AE: [
    { label: 'UAE', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'] },
  ],
  SG: [
    { label: 'Singapore', cities: ['Singapore'] },
  ],
  GB: [
    { label: 'United Kingdom', cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham'] },
  ],
}

/**
 * Get curated city groups for a given country + optional state.
 * Returns null if no curated data exists (fall back to library).
 */
export function getCuratedCities(countryCode: string, stateCode?: string): CityGroup[] | null {
  // Country-level curated (no state field countries)
  if (COUNTRY_CITIES[countryCode]) {
    return COUNTRY_CITIES[countryCode]
  }

  // US state-level curated
  if (countryCode === 'US' && stateCode && US_STATE_CITIES[stateCode]) {
    return US_STATE_CITIES[stateCode]
  }

  return null
}
