import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CheckoutSuccessPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateRegistrationStatus = async () => {
      if (!eventId || !user) {
        setStatus('error');
        setError('Invalid event or user');
        return;
      }

      try {
        // Update registration status to confirmed
        const { error: updateError } = await supabase
          .from('event_registrations')
          .update({ status: 'confirmed' })
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .eq('status', 'pending');

        if (updateError) throw updateError;

        // Update event participants count
        const { error: eventError } = await supabase.rpc('increment_event_participants', {
          event_id: eventId
        });

        if (eventError) throw eventError;

        setStatus('success');
        toast.success('Successfully registered for event!');
      } catch (err) {
        console.error('Error updating registration:', err);
        setStatus('error');
        setError('Failed to update registration status');
        toast.error('Failed to update registration status');
      }
    };

    updateRegistrationStatus();
  }, [eventId, user]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-800 mt-4">Processing your registration...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            {status === 'success' ? (
              <>
                <div className="mb-6">
                  <CheckCircle size={64} className="text-green-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Registration Successful!
                </h1>
                <p className="text-gray-600 mb-8">
                  Thank you for registering for the event. You will receive a confirmation email shortly.
                </p>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <XCircle size={64} className="text-red-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Registration Failed
                </h1>
                <p className="text-gray-600 mb-8">
                  {error || 'There was an error processing your registration. Please try again.'}
                </p>
              </>
            )}

            <div className="space-y-4">
              <button
                onClick={() => navigate(`/events/${eventId}`)}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Back to Event
              </button>
              
              <button
                onClick={() => navigate('/events')}
                className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Browse More Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;