import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import { Calendar, MapPin, Users, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <Link href={`/events/${event.id}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              data-ai-hint={`${event.type.toLowerCase()} event`}
            />
            {event.rsvp && (
              <div className="absolute top-2 right-2">
                {event.rsvp === 'going' && <Badge variant="secondary"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Going</Badge>}
                {event.rsvp === 'interested' && <Badge variant="secondary"><Star className="w-4 h-4 mr-1 text-yellow-500" /> Interested</Badge>}
              </div>
            )}
          </div>
          <div className="p-6">
            <Badge variant="outline" className="mb-2">{event.type}</Badge>
            <CardTitle className="font-headline text-xl leading-tight group-hover:text-primary transition-colors">
              {event.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{isClient ? format(new Date(event.date), 'EEE, MMM d, yyyy') : ' '}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{event.attendees.going} going</span>
            <span className="mx-1.5">·</span>
            <span>{event.attendees.interested} interested</span>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </CardFooter>
      </Card>
    </Link>
  );
}
