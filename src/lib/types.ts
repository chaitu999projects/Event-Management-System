export type EventType = 'Conference' | 'Workshop' | 'Meetup' | 'Social' | 'Other';
export type RsvpStatus = 'going' | 'interested' | null;

export interface Event {
  id: string;
  name: string;
  type: EventType;
  date: string; // ISO string for date and time
  location: string;
  description: string;
  imageUrl: string;
  organizer: string;
  attendees: {
    going: number;
    interested: number;
  };
  rsvp: RsvpStatus;
}
