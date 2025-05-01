import React, { useState } from 'react';
import { FilterOptions, EventType } from '../../types';
import { Search, X, Filter, Calendar, SlidersHorizontal } from 'lucide-react';
import { colleges } from '../../data/mockData';

interface EventFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      ...filters,
      search: searchTerm,
    });
  };

  const eventTypes: { value: EventType | ''; label: string }[] = [
    { value: '', label: 'All Event Types' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'tech-talk', label: 'Tech Talk' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' },
  ];

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSearchSubmit}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events, keywords, organizers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  onFilterChange({
                    ...filters,
                    search: '',
                  });
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Event Type Select */}
          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              name="eventType"
              value={filters.eventType}
              onChange={handleInputChange}
              className="appearance-none w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Date Filter */}
          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="Start date"
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={toggleAdvanced}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center transition-colors"
          >
            <SlidersHorizontal size={16} className="mr-1" />
            {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Filters
          </button>

          {Object.values(filters).some(value => value !== '') && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center transition-colors"
            >
              <X size={16} className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {/* College Filter */}
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                College
              </label>
              <select
                id="college"
                name="college"
                value={filters.college}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Colleges</option>
                {colleges.map((college) => (
                  <option key={college.id} value={college.name}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            {/* End Date Filter */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleInputChange}
                placeholder="City, state, or 'Virtual'"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EventFilters;