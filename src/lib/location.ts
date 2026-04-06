import { Country, State, City, type ICountry, type IState, type ICity } from 'country-state-city'
import { COUNTRIES_WITH_STATE_FIELD } from '@/lib/locationData'

// --- Chapter data (SAGIE presence) ---

/** ISO codes of countries with active or upcoming chapters */
export const CHAPTER_COUNTRY_CODES = ['US', 'IL', 'SG', 'AE'] as const

/** Chapter cities keyed by country ISO code */
export const CHAPTER_CITIES: Record<string, string[]> = {
  US: ['Miami', 'New York City', 'Dallas'],
  IL: ['Tel Aviv'],
  SG: ['Singapore'],
  AE: ['Dubai'],
}

// --- Sorted country list (chapter countries first) ---

const chapterSet = new Set<string>(CHAPTER_COUNTRY_CODES)

const allCountries = Country.getAllCountries()
const chapterCountries = CHAPTER_COUNTRY_CODES
  .map((code) => allCountries.find((c) => c.isoCode === code))
  .filter((c): c is ICountry => c !== undefined)
const FILTERED_COUNTRY_CODES = new Set(['PS'])

const otherCountries = allCountries
  .filter((c) => !chapterSet.has(c.isoCode) && !FILTERED_COUNTRY_CODES.has(c.isoCode))
  .sort((a, b) => a.name.localeCompare(b.name))

/** All countries — chapter countries first, then alphabetical rest */
export const SORTED_COUNTRIES: ICountry[] = [...chapterCountries, ...otherCountries]

// --- State/city helpers ---

export function getStates(countryCode: string): IState[] {
  return State.getStatesOfCountry(countryCode)
}

export function getCities(countryCode: string, stateCode?: string): ICity[] {
  if (stateCode) {
    return City.getCitiesOfState(countryCode, stateCode)
  }
  return City.getCitiesOfCountry(countryCode) ?? []
}

/** Only show state field for these 6 countries, regardless of library data */
export function showStateField(countryCode: string): boolean {
  return COUNTRIES_WITH_STATE_FIELD.has(countryCode)
}

/** Check if a city is a chapter city for the given country */
export function isChapterCity(countryCode: string, cityName: string): boolean {
  return CHAPTER_CITIES[countryCode]?.includes(cityName) ?? false
}

/** Sort cities — chapter cities first, then alphabetical */
export function sortedCities(countryCode: string, cities: ICity[]): ICity[] {
  const chapterNames = new Set(CHAPTER_CITIES[countryCode] ?? [])
  const chapter: ICity[] = []
  const rest: ICity[] = []
  for (const city of cities) {
    if (chapterNames.has(city.name)) {
      chapter.push(city)
    } else {
      rest.push(city)
    }
  }
  return [...chapter, ...rest]
}
