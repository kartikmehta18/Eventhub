import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink, ChevronLeft, Tag, Users, Bookmark } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import Badge from '../components/ui/Badge';
import EventRegistrationButton from '../components/events/EventRegistrationButton';
import { Event } from '../types';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEvent = async () => {
      if (id) {
        const fetchedEvent = await getEventById(id);
        if (isMounted) {
          setEvent(fetchedEvent);
          setIsLoading(false);
          if (!fetchedEvent) {
            navigate('/events');
          }
        }
      } else {
        setIsLoading(false);
        navigate('/events');
      }
    };
    fetchEvent();
    return () => { isMounted = false; };
  }, [id, getEventById, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Skeleton loader */}
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-8 space-y-6">
                <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null; // Will redirect in useEffect
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Link
            to="/events"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium mb-6 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Events
          </Link>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Event Image */}
            <div className="relative h-64 md:h-80 bg-gray-200">
              <img
                src={event.image_url || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge type={event.type} className="text-sm px-3 py-1" />
              </div>
              {event.featured && (
                <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs py-1 px-3 rounded-lg">
                  Featured
                </div>
              )}
            </div>
            {/* Event Content */}
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {event.title}
              </h1>
              {/* Event Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <Calendar size={20} className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">Date & Time</h3>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                    {event.end_date && (
                      <p className="text-gray-600">
                        to {formatDate(event.end_date)}
                      </p>
                    )}
                    <p className="text-gray-600 mt-1">
                      <Clock size={14} className="inline mr-1" />
                      {event.time}
                    </p>
                    {event.registration_deadline && (
                      <p className="text-gray-500 text-sm mt-1">
                        Registration Deadline: {formatDate(event.registration_deadline)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin size={20} className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-700">Location</h3>
                    <p className="text-gray-600">
                      {event.is_virtual ? 'Virtual Event' : event.location}
                    </p>
                    {event.college && (
                      <>
                        <p className="text-gray-600">{event.college.name}</p>
                        <p className="text-gray-500 text-sm">{event.college.location}</p>
                      </>
                    )}
                  </div>
                </div>
                {event.organizer && (
                  <div className="flex items-start">
                    <Users size={20} className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-700">Organizer</h3>
                      <p className="text-gray-600">{event.organizer}</p>
                    </div>
                  </div>
                )}
                {event.event_tags && event.event_tags.length > 0 && (
                  <div className="flex items-start">
                    <Tag size={20} className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-700">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {event.event_tags.map((tagObj: any) => (
                          <span
                            key={tagObj.tag}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            {tagObj.tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  About This Event
                </h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{event.description}</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <EventRegistrationButton
                  eventId={event.id}
                  isPaid={event.is_paid}
                  price={event.price}
                  maxParticipants={event.max_participants}
                  currentParticipants={event.current_participants}
                />
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                >
                  <ExternalLink size={18} className="mr-2" />
                  <span>Event Website</span>
                </a>
              </div>
            </div>
          </div>
          {/* College Info */}
          {event.college && (
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex items-center mb-4">
                <img
                  src={event.college.logo || 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                  alt={event.college.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {event.college.name}
                  </h2>
                  <p className="text-gray-600">{event.college.location}</p>
                </div>
              </div>
              {event.college.website && (
                <div className="flex justify-end">
                  <a
                    href={event.college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center transition-colors"
                  >
                    <span>Visit College Website</span>
                    <ExternalLink size={16} className="ml-1" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;