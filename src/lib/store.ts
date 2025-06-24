import { create } from 'zustand';
import type { Event, RsvpStatus } from './types';

interface EventState {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'attendees' | 'rsvp'>) => Event;
  updateRsvp: (eventId: string, rsvp: RsvpStatus) => void;
}

const initialEvents: Event[] = [
  {
    id: '1',
    name: 'Global Tech Summit 2024',
    type: 'Conference',
    date: new Date('2024-08-10T10:00:00Z').toISOString(),
    location: 'Virtual Event',
    description: 'Join thousands of tech enthusiasts and professionals at the Global Tech Summit. Explore the latest trends in AI, blockchain, and cloud computing with industry leaders.',
    imageUrl: 'https://placehold.co/1200x600.png',
    organizer: 'Tech Innovations Inc.',
    attendees: { going: 1200, interested: 3400 },
    rsvp: null,
  },
  {
    id: '2',
    name: 'Creative Coding Workshop',
    type: 'Workshop',
    date: new Date('2024-08-25T14:00:00Z').toISOString(),
    location: '123 Art Avenue, Metropia',
    description: 'Unleash your creativity in our hands-on coding workshop. Learn to build interactive art and visualizations using modern web technologies. No prior experience needed!',
    imageUrl: 'https://placehold.co/1200x600.png',
    organizer: 'Art & Code Collective',
    attendees: { going: 45, interested: 150 },
    rsvp: 'interested',
  },
  {
    id: '3',
    name: 'Startup Founders Meetup',
    type: 'Meetup',
    date: new Date('2024-09-05T18:30:00Z').toISOString(),
    location: 'The Hub Co-working, Capital City',
    description: 'Connect with fellow startup founders, share your journey, and find potential collaborators. A great networking opportunity for entrepreneurs at any stage.',
    imageUrl: 'https://placehold.co/1200x600.png',
    organizer: 'Founder Circle',
    attendees: { going: 88, interested: 210 },
    rsvp: null,
  },
  {
    id: '4',
    name: 'Summer Music Fest',
    type: 'Social',
    date: new Date('2024-09-20T12:00:00Z').toISOString(),
    location: 'Green Park, Downtown',
    description: 'Enjoy a day of live music, food trucks, and fun under the sun. Featuring local bands and artists across various genres. A perfect summer day out!',
    imageUrl: 'https://placehold.co/1200x600.png',
    organizer: 'City Events Committee',
    attendees: { going: 2500, interested: 7800 },
    rsvp: 'going',
  },
];


export const useEventStore = create<EventState>((set, get) => ({
  events: initialEvents,
  addEvent: (newEventData) => {
    const newEvent: Event = {
      ...newEventData,
      id: new Date().getTime().toString(),
      attendees: { going: 0, interested: 0 },
      rsvp: null,
    };
    set((state) => ({ events: [...state.events, newEvent] }));
    return newEvent;
  },
  updateRsvp: (eventId, rsvp) => {
    set((state) => {
      const eventIndex = state.events.findIndex((e) => e.id === eventId);
      if (eventIndex === -1) return state;

      const updatedEvents = [...state.events];
      const event = { ...updatedEvents[eventIndex] };
      const oldRsvp = event.rsvp;

      // Update counts
      if (oldRsvp === 'going') event.attendees.going--;
      if (oldRsvp === 'interested') event.attendees.interested--;
      if (rsvp === 'going') event.attendees.going++;
      if (rsvp === 'interested') event.attendees.interested++;

      // Set new RSVP status
      event.rsvp = rsvp;
      updatedEvents[eventIndex] = event;

      return { events: updatedEvents };
    });
  },
}));
