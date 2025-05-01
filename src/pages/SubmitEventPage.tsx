import React from 'react';
import EventSubmissionForm from '../components/forms/EventSubmissionForm';

const SubmitEventPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit an Event</h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              Share tech events happening at your college with our community. Fill out the form below with all the details.
            </p>
          </div>
          
          <EventSubmissionForm />
        </div>
      </div>
    </div>
  );
};

export default SubmitEventPage;