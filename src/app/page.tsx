'use client';

import { useState, useMemo } from 'react';
import { useEventStore, type Event } from '@/lib/store';
import { AppLayout } from '@/components/layout/app-layout';
import { Header } from '@/components/layout/header';
import { EventCard } from '@/components/events/event-card';
import { EventFilters } from '@/components/events/event-filters';

export default function EventsPage() {
  const allEvents = useEventStore((state) => state.events);
  const [filters, setFilters] = useState<{
    keyword: string;
    date: Date | undefined;
    type: string;
  }>({
    keyword: '',
    date: undefined,
    type: 'all',
  });

  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    if (filters.keyword) {
      events = events.filter((event) =>
        event.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.date) {
      events = events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === filters.date!.getFullYear() &&
          eventDate.getMonth() === filters.date!.getMonth() &&
          eventDate.getDate() === filters.date!.getDate()
        );
      });
    }

    if (filters.type && filters.type !== 'all') {
      events = events.filter((event) => event.type === filters.type);
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, filters]);
  
  return (
    <AppLayout>
      <div className="flex-1">
        <Header title="Events" description="Browse and discover exciting events." />
        <main className="p-4 md:p-6 space-y-6">
          <EventFilters onFilterChange={setFilters} />
          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <h3 className="text-xl font-semibold">No Events Found</h3>
              <p>Try adjusting your filters or check back later!</p>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
