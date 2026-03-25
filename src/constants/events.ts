export interface SagieEvent {
  id: string
  name: string
  date: string
  time?: string
  type: 'SAGIE Event' | 'Local Event' | 'Webinar'
  format: string
  status: 'Confirmed' | 'Live' | 'Planning' | 'Complete'
  venue?: string
  description: string
  expectedAttendees?: number
  actualAttendees?: number
  tierTarget?: string
  chapter: 'Miami' | 'Tel Aviv' | 'Online'
  speakers?: string[]
  webinarLink?: string
  recordingLink?: string
  photoGallery?: string
  eventImage?: string
}

export const MOCK_EVENTS: SagieEvent[] = [
  {
    id: 'miami-founders-dinner',
    name: 'Miami Founders Dinner',
    date: 'April 12, 2026',
    time: '7:00 PM EST',
    type: 'SAGIE Event',
    format: 'Dinner',
    status: 'Confirmed',
    venue: 'Wynwood, Miami',
    description:
      'An intimate dinner for builders and operators in the Miami ecosystem. Curated conversations, no pitches — just real connection over a shared table.',
    expectedAttendees: 30,
    tierTarget: 'Builder',
    chapter: 'Miami',
    speakers: ['Sagie Baram'],
    eventImage: '/events/founders-dinner.jpg',
  },
  {
    id: 'ecosystem-builder-fireside',
    name: 'Ecosystem Builder Fireside',
    date: 'April 28, 2026',
    time: '6:30 PM EST',
    type: 'SAGIE Event',
    format: 'Fireside Chat',
    status: 'Planning',
    venue: 'TBD, Miami',
    description:
      'A fireside conversation exploring what it really takes to build ecosystems that last. Cross-tier event open to all SAGIE members.',
    expectedAttendees: 50,
    tierTarget: 'Cross-Tier',
    chapter: 'Miami',
  },
  {
    id: 'miami-tech-week-founder-summit',
    name: 'Miami Tech Week Founder Summit',
    date: 'May 6, 2026',
    time: '10:00 AM EST',
    type: 'Local Event',
    format: 'Summit',
    status: 'Confirmed',
    venue: 'Downtown Miami',
    description:
      'The annual founder summit during Miami Tech Week. SAGIE members get priority access and curated introductions.',
    expectedAttendees: 200,
    chapter: 'Miami',
  },
  {
    id: 'community-that-scales-webinar',
    name: 'How to Build a Community That Actually Scales',
    date: 'April 20, 2026',
    time: '6:00 PM EST',
    type: 'Webinar',
    format: 'Live Webinar',
    status: 'Confirmed',
    venue: 'Zoom',
    description:
      'A tactical session on the frameworks, rituals, and systems behind communities that grow without losing their soul.',
    expectedAttendees: 120,
    chapter: 'Online',
    speakers: ['Sagie Baram'],
    webinarLink: '#',
  },
  {
    id: 'miami-season-opener',
    name: 'SAGIE Miami Season Opener',
    date: 'March 10, 2026',
    time: '7:00 PM EST',
    type: 'SAGIE Event',
    format: 'Launch Event',
    status: 'Complete',
    venue: 'Brickell, Miami',
    description:
      "The kick-off event for SAGIE Miami's 2026 season. 60 founders, operators, and builders came together to set the tone for the year ahead.",
    expectedAttendees: 60,
    actualAttendees: 60,
    chapter: 'Miami',
    photoGallery: '#',
    eventImage: '/events/season-opener.jpg',
  },
]
