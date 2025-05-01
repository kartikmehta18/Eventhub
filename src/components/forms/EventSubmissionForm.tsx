import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Link as LinkIcon, Tags, School, Users, Check } from 'lucide-react';
import { Event, EventType, College } from '../../types';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface EventSubmissionFormProps {
}

const EventSubmissionForm: React.FC<EventSubmissionFormProps> = () => {
  const { addEvent } = useEvents();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [colleges, setColleges] = useState<College[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    end_date: '',
    time: '',
    type: '' as EventType | '',
    college_id: '',
    location: '',
    is_virtual: false,
    link: '',
    image_url: '',
    registration_deadline: '',
    organizer: '',
    tags: '',
    is_paid: false,
    price: '',
    max_participants: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes: { value: EventType; label: string }[] = [
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'tech-talk', label: 'Tech Talk' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }
    
    if (!formData.time.trim()) {
      newErrors.time = 'Event time is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Event type is required';
    }
    
    if (!formData.college_id) {
      newErrors.college_id = 'College is required';
    }
    
    if (!formData.is_virtual && !formData.location.trim()) {
      newErrors.location = 'Location is required for in-person events';
    }
    
    if (!formData.link.trim()) {
      newErrors.link = 'Event link is required';
    } else if (!/^https?:\/\//.test(formData.link)) {
      newErrors.link = 'Link must start with http:// or https://';
    }

    if (formData.is_paid && !formData.price.trim()) {
      newErrors.price = 'Price is required for paid events';
    } else if (formData.is_paid && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }

    if (formData.max_participants && isNaN(Number(formData.max_participants))) {
      newErrors.max_participants = 'Maximum participants must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({
        top: document.querySelector('.error')?.getBoundingClientRect().top ?? 0 + window.scrollY - 100,
        behavior: 'smooth',
      });
      return;
    }

    try {
      const tagArray = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : undefined;

      const eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'> = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        end_date: formData.end_date || null,
        time: formData.time,
        type: formData.type as EventType,
        college_id: formData.college_id,
        location: formData.is_virtual ? 'Virtual' : formData.location,
        is_virtual: formData.is_virtual,
        link: formData.link,
        image_url: formData.image_url || null,
        registration_deadline: formData.registration_deadline || null,
        organizer: formData.organizer || null,
        created_by: user?.id,
      };

      await addEvent(eventData, tagArray);
      setIsSubmitted(true);
      
      setFormData({
        title: '',
        description: '',
        date: '',
        end_date: '',
        time: '',
        type: '',
        college_id: '',
        location: '',
        is_virtual: false,
        link: '',
        image_url: '',
        registration_deadline: '',
        organizer: '',
        tags: '',
        is_paid: false,
        price: '',
        max_participants: '',
      });
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      toast.success('Event submitted successfully!');
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error('Failed to submit event. Please try again.');
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      {isSubmitted && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
          <Check size={20} className="text-green-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium">Event Submitted Successfully!</h3>
            <p className="text-sm">Thank you for contributing to our event platform. Your event will be available in the events list.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Event Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Information</h3>
            
            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Annual Hackathon 2025"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 error">{errors.title}</p>
                )}
              </div>

              {/* Event Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Provide a detailed description of the event..."
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 error">{errors.description}</p>
                )}
              </div>

              {/* Event Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none ${
                      errors.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Event Type</option>
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
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600 error">{errors.type}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Date and Time</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                      errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 error">{errors.date}</p>
                )}
              </div>

              {/* End Date (Optional) */}
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    min={formData.date}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                      errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600 error">{errors.time}</p>
                )}
              </div>

              {/* Registration Deadline (Optional) */}
              <div>
                <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Deadline <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="registration_deadline"
                    name="registration_deadline"
                    value={formData.registration_deadline}
                    onChange={handleInputChange}
                    max={formData.date}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location and Venue */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location and College</h3>
            
            <div className="space-y-4">
              {/* College */}
              <div>
                <label htmlFor="college_id" className="block text-sm font-medium text-gray-700 mb-1">
                  College <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <School size={16} className="text-gray-400" />
                  </div>
                  <select
                    id="college_id"
                    name="college_id"
                    value={formData.college_id}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none ${
                      errors.college_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select College</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.college_id && (
                  <p className="mt-1 text-sm text-red-600 error">{errors.college_id}</p>
                )}
              </div>

              {/* Virtual Event Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_virtual"
                  name="is_virtual"
                  checked={formData.is_virtual}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_virtual" className="ml-2 text-sm text-gray-700">
                  This is a virtual event
                </label>
              </div>

              {/* Location (for in-person events) */}
              {!formData.is_virtual && (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                        errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Computer Science Building, Room 305"
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 error">{errors.location}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
            
            <div className="space-y-4">
              {/* Event Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LinkIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                      errors.link ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/event"
                  />
                </div>
                {errors.link && (
                  <p className="mt-1 text-sm text-red-600 error">{errors.link}</p>
                )}
              </div>

              {/* Event Image URL */}
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image URL <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Provide a URL to an image that represents the event. Recommended size: 1200x630 pixels.
                </p>
              </div>

              {/* Organizer */}
              <div>
                <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Users size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Computer Science Department"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags <span className="text-gray-400">(Optional, comma-separated)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Tags size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., AI, machine learning, data science"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Add tags to help others find your event. Separate tags with commas.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Registration Settings</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_paid"
                name="is_paid"
                checked={formData.is_paid}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="is_paid" className="ml-2 text-sm text-gray-700">
                This is a paid event
              </label>
            </div>

            {formData.is_paid && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Participants <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="number"
                id="max_participants"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.max_participants ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Leave empty for unlimited"
              />
              {errors.max_participants && (
                <p className="mt-1 text-sm text-red-600">{errors.max_participants}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Submit Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventSubmissionForm;