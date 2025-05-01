import React from 'react';
import EventCard from './EventCard';
import { Event } from '../../types';

interface EventGridProps {
  events: Event[];
  featured?: boolean;
}

const EventGrid: React.FC<EventGridProps> = ({ events, featured = false }) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <img
          src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="No events found"
          className="w-48 h-48 object-cover rounded-lg mb-4 opacity-50"
        />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
        <p className="text-gray-500 text-center max-w-md">
          We couldn't find any events matching your criteria. Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 gap-y-8 px-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} featured={featured && event.featured} />
      ))}
    </div>
  );
};

export default EventGrid;