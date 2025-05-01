import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, FilterOptions, EventType, Database } from '../types';
import { supabase } from '../lib/supabase';

interface EventContextType {
  events: Event[];
  filteredEvents: Event[];
  featuredEvents: Event[];
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  addEvent: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>, tags?: string[]) => Promise<void>;
  getEventById: (id: string) => Promise<Event | null>;
  clearFilters: () => void;
  loading: boolean;
}

const defaultFilters: FilterOptions = {
  search: '',
  eventType: '',
  college: '',
  startDate: '',
  endDate: '',
  location: '',
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_tags (
            tag
          )
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (
    eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>,
    tags?: string[]
  ) => {
    try {
      // Insert event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (eventError) throw eventError;

      // Insert tags if provided
      if (tags && tags.length > 0 && event) {
        const tagData = tags.map(tag => ({
          event_id: event.id,
          tag: tag.trim()
        }));

        const { error: tagError } = await supabase
          .from('event_tags')
          .insert(tagData);

        if (tagError) throw tagError;
      }

      // Refresh events list
      await fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const getEventById = async (id: string): Promise<Event | null> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_tags (
            tag
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  };

  const filteredEvents = events.filter((event) => {
    // Search filter - check title, description, and organizer
    if (
      filters.search &&
      !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !event.description.toLowerCase().includes(filters.search.toLowerCase()) &&
      !(event.organizer && event.organizer.toLowerCase().includes(filters.search.toLowerCase()))
    ) {
      return false;
    }

    // Event type filter
    if (filters.eventType && event.type !== filters.eventType) {
      return false;
    }

    // College filter
    if (filters.college && event.college_id !== filters.college) {
      return false;
    }

    // Start date filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const eventDate = new Date(event.date);
      if (eventDate < startDate) {
        return false;
      }
    }

    // End date filter
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const eventDate = new Date(event.date);
      if (eventDate > endDate) {
        return false;
      }
    }

    // Location filter
    if (
      filters.location &&
      !event.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const featuredEvents = events.filter((event) => event.featured);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents,
        featuredEvents,
        filters,
        setFilters,
        addEvent,
        getEventById,
        clearFilters,
        loading
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};