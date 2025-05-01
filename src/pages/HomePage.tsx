import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Filter, MapPin, Search, ExternalLink, ArrowRight } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';

const HomePage: React.FC = () => {
  const { featuredEvents, events } = useEvents();

  // Get upcoming events (next 3)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                Discover Tech Events
                <span className="block text-purple-300">Across College Campuses</span>
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-lg animate-fade-in-delay">
                Your central hub for hackathons, tech talks, workshops, and conferences. Never miss an opportunity to learn, connect, and grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
                <Link
                  to="/events"
                  className="group bg-white text-purple-700 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
                >
                  Explore Events
                  <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/submit"
                  className="group bg-transparent text-white border-2 border-white hover:bg-white hover:text-purple-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
                >
                  Submit an Event
                  <Calendar size={20} className="ml-2 transform group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 perspective-1000">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-2xl border border-white/20 transform rotate-2 hover:rotate-0 transition-all duration-500 animate-float">
                <div className="flex items-center mb-6">
                  <Calendar className="text-purple-300 mr-2" size={24} />
                  <h3 className="text-2xl font-bold">Latest Event Highlights</h3>
                </div>
                <div className="space-y-4">
                  {featuredEvents.slice(0, 3).map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="block group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-purple-800 rounded-lg flex flex-col items-center justify-center text-center transform group-hover:scale-105 transition-transform">
                          <span className="text-sm font-bold">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-xl font-bold">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold mb-1 group-hover:text-purple-300 transition-colors">
                            {event.title}
                          </h4>
                          <div className="flex items-center text-sm text-purple-200">
                            <MapPin size={14} className="mr-1" />
                            <span className="truncate">{event.isVirtual ? 'Virtual' : event.location}</span>
                          </div>
                        </div>
                        <ExternalLink 
                          size={16} 
                          className="text-purple-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/events"
                  className="mt-6 block text-center text-purple-200 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors group"
                >
                  View All Events
                  <ArrowRight size={16} className="inline ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              EventHub brings together tech events from colleges nationwide, making it easy to discover and participate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Search size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Discover Events
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find tech talks, hackathons, workshops, and conferences from top colleges all in one place. Never miss out on opportunities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Filter size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Filter and Find
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Easily filter events by date, type, college, or location. Find exactly what you're looking for with our advanced search.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Submit Events
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share your college's events with our community. Increase visibility and participation with our simple submission process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="group text-purple-600 hover:text-purple-800 font-medium transition-colors flex items-center"
            >
              View All
              <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {upcomingEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-6">No upcoming events found.</p>
              <Link
                to="/submit"
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors group"
              >
                Submit an Event
                <Calendar size={20} className="ml-2 transform group-hover:rotate-12 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Share Your Event?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Help fellow students discover amazing tech opportunities at your college. Submit your event today!
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center bg-white text-purple-600 hover:bg-purple-50 font-medium px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group"
            >
              Submit an Event
              <ArrowRight size={24} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;