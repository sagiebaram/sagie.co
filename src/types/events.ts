export interface SAGIEEvent {
  id: string
  name: string
  date: string | null
  time: string | null
  type: 'SAGIE Event' | 'Local Event' | 'Webinar' | null
  format: string | null
  status: 'Confirmed' | 'Live' | 'Planning' | 'Complete' | 'Concept' | 'Cancelled'
  venue: string | null
  description: string | null
  expectedAttendees: number | null
  actualAttendees: number | null
  tierTarget: string | null
  chapter: string | null
  speakers: string | null
  webinarLink: string | null
  recordingLink: string | null
  photoGallery: string | null
  eventImage: string | null
  registrationLink: string | null
  moreInfoLink: string | null
  recapLink: string | null
}
