'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { EventType } from '@/lib/types';

interface EventFiltersProps {
  onFilterChange: (filters: {
    keyword: string;
    date: Date | undefined;
    type: string;
  }) => void;
}

const eventTypes: EventType[] = ['Conference', 'Workshop', 'Meetup', 'Social', 'Other'];

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [type, setType] = useState('all');

  useEffect(() => {
    onFilterChange({ keyword, date, type });
  }, [keyword, date, type, onFilterChange]);
  
  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Input
        placeholder="Search by keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="flex-grow"
      />
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
               {date && <X onClick={clearDate} className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eventTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
