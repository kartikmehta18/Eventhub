import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import EventFilters from '../components/events/EventFilters';
import EventGrid from '../components/events/EventGrid';
import { FilterIcon } from 'lucide-react';

const EventsPage: React.FC = () => {
  const { filteredEvents, filters, setFilters, clearFilters } = useEvents();
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleMobileFilters = () => {
    setIsFilterMobileOpen(!isFilterMobileOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-7xl">
        {/* Page Header */}
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tech Events</h1>
          <p className="text-gray-600">
            Discover upcoming tech talks, hackathons, workshops, and conferences from colleges nationwide.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleMobileFilters}
            className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FilterIcon size={18} />
            <span>{isFilterMobileOpen ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop Always Visible, Mobile Toggleable */}
          <div
            className={`w-full md:w-1/4 ${isFilterMobileOpen ? 'block' : 'hidden md:block'} mb-4 md:mb-0`}
          >
            <EventFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Event Listings */}
          <div className="w-full md:w-3/4 flex flex-col items-center mt-16">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-6 w-full">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Event Count */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center w-full">
                  <p className="text-gray-600">
                    <span className="font-semibold">{filteredEvents.length}</span>{' '}
                    {filteredEvents.length === 1 ? 'event' : 'events'} found
                  </p>
                  <div className="text-gray-500 text-sm mt-2 sm:mt-0">
                    Sorted by date (newest first)
                  </div>
                </div>

                {/* Event Grid */}
                <div className="w-full">
                  <EventGrid events={filteredEvents} featured={true} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;