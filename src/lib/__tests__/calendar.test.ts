import { describe, test, expect } from 'vitest'
import {
  escapeIcsText,
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  buildIcsContent,
} from '@/lib/calendar'
import type { SAGIEEvent } from '@/types/events'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MOCK_EVENT_TIMED = {
  id: 'event-timed-1',
  name: 'SAGIE Summit',
  date: '2026-04-05',
  time: '14:30',
  type: 'SAGIE Event',
  format: 'Conference',
  status: 'Confirmed',
  tierTarget: 'All',
  venue: 'Tel Aviv Convention Center',
  description: 'Join us for the annual Summit.\nMultiple lines, and characters; like backslashes\\',
  registrationLink: 'https://sagie.co/register',
  speakers: '',
} as SAGIEEvent

const MOCK_EVENT_ALL_DAY = {
  id: 'event-allday-1',
  name: 'SAGIE Hackathon',
  date: '2026-04-10',
  type: 'Local Event',
  format: 'Hackathon',
  status: 'Confirmed',
  tierTarget: 'All',
  speakers: '',
} as SAGIEEvent

const MOCK_EVENT_MINIMAL = {
  id: 'event-minimal-1',
  name: 'Minimal Event',
  type: 'Webinar',
  format: 'Workshop',
  status: 'Planning',
  tierTarget: 'All',
  speakers: '',
} as SAGIEEvent

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('calendar helpers', () => {
  describe('escapeIcsText', () => {
    test('escapes backslashes, semicolons, commas, and newlines', () => {
      const input = 'Line 1\nLine 2, with comma; and semi-colon\\backslash'
      const expected = 'Line 1\\nLine 2\\, with comma\\; and semi-colon\\\\backslash'
      expect(escapeIcsText(input)).toBe(expected)
    })
  })

  describe('buildGoogleCalendarUrl', () => {
    test('builds URL for timed event', () => {
      const url = new URL(buildGoogleCalendarUrl(MOCK_EVENT_TIMED))
      expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render')
      
      const params = url.searchParams
      expect(params.get('action')).toBe('TEMPLATE')
      expect(params.get('text')).toBe('SAGIE Summit')
      expect(params.get('dates')).toBe('20260405T143000/20260405T153000')
      expect(params.get('location')).toBe('Tel Aviv Convention Center')
      expect(params.get('details')).toContain('Join us for the annual Summit')
      expect(params.get('details')).toContain('Register: https://sagie.co/register')
    })

    test('builds URL for all-day event', () => {
      const url = new URL(buildGoogleCalendarUrl(MOCK_EVENT_ALL_DAY))
      const params = url.searchParams
      
      expect(params.get('text')).toBe('SAGIE Hackathon')
      // 2026-04-10 + 1 day
      expect(params.get('dates')).toBe('20260410/20260411')
    })

    test('builds URL without dates if missing', () => {
      const url = new URL(buildGoogleCalendarUrl(MOCK_EVENT_MINIMAL))
      const params = url.searchParams
      expect(params.get('text')).toBe('Minimal Event')
      expect(params.has('dates')).toBe(false)
    })
  })

  describe('buildOutlookCalendarUrl', () => {
    test('builds URL for timed event', () => {
      const url = new URL(buildOutlookCalendarUrl(MOCK_EVENT_TIMED))
      expect(url.origin + url.pathname).toBe('https://outlook.live.com/calendar/0/action/compose')
      
      const params = url.searchParams
      expect(params.get('rru')).toBe('addevent')
      expect(params.get('subject')).toBe('SAGIE Summit')
      expect(params.get('startdt')).toBe('2026-04-05T14:30:00')
      expect(params.get('enddt')).toBe('2026-04-05T15:30:00')
      expect(params.get('location')).toBe('Tel Aviv Convention Center')
      expect(params.get('body')).toContain('Join us for the annual Summit')
      expect(params.get('body')).toContain('Register: https://sagie.co/register')
    })

    test('builds URL for all-day event', () => {
      const url = new URL(buildOutlookCalendarUrl(MOCK_EVENT_ALL_DAY))
      const params = url.searchParams
      
      expect(params.get('subject')).toBe('SAGIE Hackathon')
      expect(params.get('startdt')).toBe('2026-04-10')
      expect(params.get('enddt')).toBe('2026-04-11')
      expect(params.get('allday')).toBe('true')
    })
  })

  describe('buildIcsContent', () => {
    test('generates valid ICS for timed event', () => {
      const ics = buildIcsContent(MOCK_EVENT_TIMED)
      
      expect(ics).toContain('BEGIN:VCALENDAR')
      expect(ics).toContain('VERSION:2.0')
      expect(ics).toContain('BEGIN:VEVENT')
      expect(ics).toContain('UID:event-timed-1@sagie.co')
      expect(ics).toContain('DTSTART:20260405T143000Z')
      expect(ics).toContain('DTEND:20260405T153000Z')
      expect(ics).toContain('SUMMARY:SAGIE Summit')
      expect(ics).toContain('LOCATION:Tel Aviv Convention Center')
      expect(ics).toContain('DESCRIPTION:Join us for the annual Summit.\\nMultiple lines\\, and characters\\; like backslashes\\\\\\nRegister: https://sagie.co/register')
      expect(ics).toContain('END:VEVENT')
      expect(ics).toContain('END:VCALENDAR')
      
      // Check CRLF endings
      expect(ics).toMatch(/\r\n/g)
    })

    test('generates valid ICS for all-day event', () => {
      const ics = buildIcsContent(MOCK_EVENT_ALL_DAY)
      
      expect(ics).toContain('DTSTART;VALUE=DATE:20260410')
      expect(ics).toContain('DTEND;VALUE=DATE:20260411')
    })

    test('generates fallback ICS dates when date missing', () => {
      const ics = buildIcsContent(MOCK_EVENT_MINIMAL)
      
      expect(ics).toContain('DTSTART;VALUE=DATE:19700101')
      expect(ics).toContain('DTEND;VALUE=DATE:19700102')
    })
  })
})
