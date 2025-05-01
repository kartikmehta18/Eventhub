import React, { useState } from 'react';
import { Search, Calendar, MapPin, Clock } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';

const SearchPage: React.FC = () => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof events>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const results = events.filter((event) => {
      const search = searchTerm.toLowerCase();
      return (
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.college.name.toLowerCase().includes(search) ||
        (event.organizer && event.organizer.toLowerCase().includes(search)) ||
        event.location.toLowerCase().includes(search) ||
        (event.tags && event.tags.some((tag) => tag.toLowerCase().includes(search)))
      );
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Events</h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              Find tech events by title, description, college, or tags.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for events, colleges, or keywords..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-lg"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <span className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Search
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {searchResults.length === 0
                  ? 'No results found'
                  : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
              </h2>

              {searchResults.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <img
                    src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="No results"
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No matching events found</h3>
                  <p className="text-gray-500 mb-6">
                    Try different keywords or check out all events.
                  </p>
                  <Link
                    to="/events"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    View All Events
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="block bg-white rounded-lg shadow hover:shadow-md p-4 transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
                          <img
                            src={event.image || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                            alt={event.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <div className="flex flex-wrap items-center mb-2 gap-2">
                            <Badge type={event.type} />
                            {event.featured && (
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-purple-200">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              <span>
                                {event.isVirtual ? 'Virtual' : event.location}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center">
                            <img
                              src={event.college.logo || 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                              alt={event.college.name}
                              className="w-6 h-6 rounded-full object-cover border border-gray-200 mr-2"
                            />
                            <span className="text-xs text-gray-600">
                              {event.college.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                Enter search terms above to find events.
              </p>
              <p className="text-gray-400 text-sm">
                You can search by event name, description, college, or tags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;