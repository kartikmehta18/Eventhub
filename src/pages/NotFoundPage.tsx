import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Calendar } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <Calendar size={80} className="mx-auto text-purple-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <Home size={18} className="mr-2" />
            Go Home
          </Link>
          <Link
            to="/events"
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <Search size={18} className="mr-2" />
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;