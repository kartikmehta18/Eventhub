import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Event } from '../../types';
import Badge from '../ui/Badge';

interface EventCardProps {
  event: Event;
  featured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className={`group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full 
        ${featured ? 'border-2 border-purple-500' : 'border border-gray-200'}`}
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={event.image_url || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 p-2">
          <Badge type={event.type} />
        </div>
        {featured && (
          <div className="absolute top-0 left-0 bg-purple-600 text-white text-xs py-1 px-2 rounded-br-lg">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="text-gray-500 text-sm flex items-center mb-2">
          <Calendar size={14} className="mr-1" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin size={14} className="mr-1" />
            <span className="truncate">{event.is_virtual ? 'Virtual' : event.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                alt={'College'} 
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="ml-2 text-xs text-gray-600 truncate max-w-[100px]">
                {'Unknown College'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to={`/events/${event.id}`}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
              >
                Details
              </Link>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                aria-label="External link to event"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;