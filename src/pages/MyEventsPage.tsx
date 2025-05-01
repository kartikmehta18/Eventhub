import React from 'react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventGrid from '../components/events/EventGrid';
import { Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyEventsPage: React.FC = () => {
  const { events } = useEvents();
  const { user } = useAuth();
  
  const userEvents = events.filter(event => event.created_by === user?.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Events</h1>
            <p className="text-gray-600">
              Manage your submitted events and create new ones.
            </p>
          </div>
          
          <Link
            to="/submit"
            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create New Event
          </Link>
        </div>

        {userEvents.length > 0 ? (
          <EventGrid events={userEvents} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Events Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't created any events yet. Start by creating your first event!
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;