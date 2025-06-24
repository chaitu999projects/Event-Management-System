'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEventStore } from '@/lib/store';
import { generateDescriptionAction } from '@/lib/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const eventFormSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters.'),
  type: z.enum(['Conference', 'Workshop', 'Meetup', 'Social', 'Other']),
  date: z.date({ required_error: 'A date is required.' }),
  location: z.string().min(3, 'Location is required.'),
  organizer: z.string().min(2, 'Organizer name is required.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  imageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm() {
  const router = useRouter();
  const { toast } = useToast();
  const addEvent = useEventStore((state) => state.addEvent);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
        name: '',
        type: 'Conference',
        location: '',
        organizer: '',
        description: '',
        imageUrl: '',
    },
  });

  const onSubmit = (data: EventFormValues) => {
    const newEvent = addEvent({
        ...data,
        date: data.date.toISOString(),
        imageUrl: data.imageUrl || `https://placehold.co/600x400.png`
    });
    toast({
        title: "Event Created!",
        description: `${data.name} has been successfully created.`,
    });
    router.push(`/events/${newEvent.id}`);
  };

  const handleGenerateDescription = () => {
    const values = form.getValues();
    const { name, type, date, location } = values;
    if (!name || !type || !date || !location) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in Event Name, Type, Date, and Location before generating a description.",
        });
        return;
    }
    
    startTransition(async () => {
        const result = await generateDescriptionAction({
            eventName: name,
            eventType: type,
            eventDate: format(date, 'PPP'),
            eventTime: format(date, 'p'),
            eventLocation: location,
            eventTheme: type,
            targetAudience: 'General Audience', // This could be another form field
        });

        if (result.description) {
            form.setValue('description', result.description, { shouldValidate: true });
            toast({
                title: "Description Generated!",
                description: "The AI-powered description has been added.",
            });
        } else if (result.error) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: result.error,
            });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Global Tech Summit" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select an event type" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Conference">Conference</SelectItem>
                                    <SelectItem value="Workshop">Workshop</SelectItem>
                                    <SelectItem value="Meetup">Meetup</SelectItem>
                                    <SelectItem value="Social">Social</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date & Time</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                        >
                                            {field.value ? format(field.value, 'PPP p') : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Virtual or Physical Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Organizer</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Tech Innovations Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/image.png" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="flex items-center justify-between">
                                <span>Description</span>
                                 <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isPending}>
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate with AI
                                </Button>
                            </FormLabel>
                            <FormControl>
                                <Textarea rows={6} placeholder="Tell us more about the event..." {...field} />
                            </FormControl>
                            <FormDescription>A detailed and engaging description helps attract more attendees.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
            <CardFooter>
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Event
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
