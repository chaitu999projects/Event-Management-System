'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEventStore } from '@/lib/store';
import { AppLayout } from '@/components/layout/app-layout';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, MapPin, Star, Users, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { RsvpStatus } from '@/lib/types';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const event = useEventStore((state) => state.events.find((e) => e.id === eventId));
  const updateRsvp = useEventStore((state) => state.updateRsvp);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleRsvp = (status: RsvpStatus) => {
    if (event) {
      const newStatus = event.rsvp === status ? null : status;
      updateRsvp(event.id, newStatus);
    }
  };

  if (!event) {
    return (
      <AppLayout>
        <div className="flex-1">
            <Header title="Event Not Found" />
            <main className="p-4 md:p-6 text-center">
                <p className="mb-4">We couldn't find the event you're looking for.</p>
                <Button asChild>
                    <Link href="/">Back to Events</Link>
                </Button>
            </main>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex-1">
        <Header title={event.name} />
        <main className="p-4 md:p-6 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full md:h-96">
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                data-ai-hint={`${event.type.toLowerCase()} event`}
                priority
              />
            </div>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <Badge variant="secondary" className="mb-2">{event.type}</Badge>
                        <CardTitle className="font-headline text-3xl md:text-4xl">{event.name}</CardTitle>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button variant={event.rsvp === 'interested' ? 'default' : 'outline'} onClick={() => handleRsvp('interested')}>
                            <Star className="mr-2" /> Interested
                        </Button>
                        <Button variant={event.rsvp === 'going' ? 'default' : 'outline'} onClick={() => handleRsvp('going')}>
                            <CheckCircle className="mr-2" /> Going
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-headline text-2xl font-semibold">About this event</h3>
                <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
              <aside className="space-y-6">
                <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold">Date and Time</h4>
                        <p className="text-muted-foreground">{isClient ? `${format(new Date(event.date), 'eeee, MMMM d, yyyy')} at ${format(new Date(event.date), 'p')}` : ' '}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold">Location</h4>
                        <p className="text-muted-foreground">{event.location}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Briefcase className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold">Organizer</h4>
                        <p className="text-muted-foreground">{event.organizer}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Users className="h-6 w-6 text-primary mt-1 shrink-0" />
                    <div>
                        <h4 className="font-semibold">Attendees</h4>
                        <p className="text-muted-foreground">{event.attendees.going.toLocaleString()} going</p>
                        <p className="text-muted-foreground">{event.attendees.interested.toLocaleString()} interested</p>
                    </div>
                </div>
              </aside>
            </CardContent>
          </Card>
        </main>
      </div>
    </AppLayout>
  );
}
