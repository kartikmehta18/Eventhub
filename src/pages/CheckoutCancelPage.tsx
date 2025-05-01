import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const CheckoutCancelPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <XCircle size={64} className="text-red-500 mx-auto" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Payment Cancelled
            </h1>
            
            <p className="text-gray-600 mb-8">
              Your payment was cancelled. No charges were made to your account.
            </p>

            <div className="space-y-4">
              <Link
                to="/events"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Return to Events
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;