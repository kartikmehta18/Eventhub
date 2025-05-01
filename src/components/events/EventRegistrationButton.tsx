import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { redirectToCheckout } from '../../lib/stripe';
import { createEventRegistration, checkExistingRegistration } from '../../api/event-registrations';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface EventRegistrationButtonProps {
  eventId: string;
  isPaid: boolean;
  price: number;
  maxParticipants?: number;
  currentParticipants: number;
}

const EventRegistrationButton: React.FC<EventRegistrationButtonProps> = ({
  eventId,
  isPaid,
  price,
  maxParticipants,
  currentParticipants,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRegistration = async () => {
      if (user) {
        try {
          const { exists } = await checkExistingRegistration(eventId, user.id);
          setIsRegistered(exists);
        } catch (error) {
          console.error('Error checking registration status:', error);
        }
      }
    };

    checkRegistration();
  }, [user, eventId]);

  const handleRegistration = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Check if event is full
      if (maxParticipants !== undefined && currentParticipants >= maxParticipants) {
        toast.error('This event is full');
        return;
      }

      if (isPaid) {
        // Create a pending registration for paid events
        await createEventRegistration({
          eventId,
          userId: user.id,
          status: 'pending',
        });

        // Redirect to Stripe checkout
        await redirectToCheckout({
          eventId,
          price,
          successUrl: `${window.location.origin}/checkout/success?event_id=${eventId}`,
          cancelUrl: `${window.location.origin}/events/${eventId}`,
          metadata: {
            userId: user.id,
          },
        });
      } else {
        // Create confirmed registration for free events
        await createEventRegistration({
          eventId,
          userId: user.id,
          status: 'registered',
        });
        setIsRegistered(true);
        toast.success('Successfully registered for the event!');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === '23505') {
        toast.error('You are already registered for this event');
      } else {
        toast.error('Failed to register for the event');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <button
        disabled
        className="w-full bg-green-100 text-green-800 font-medium py-3 px-6 rounded-lg cursor-default"
      >
        Registered
      </button>
    );
  }

  const isFull = maxParticipants !== undefined && currentParticipants >= maxParticipants;

  if (isFull) {
    return (
      <button
        disabled
        className="w-full bg-gray-100 text-gray-500 font-medium py-3 px-6 rounded-lg cursor-not-allowed"
      >
        Event Full
      </button>
    );
  }

  return (
    <button
      onClick={handleRegistration}
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : isPaid ? `Register ($${price / 100})` : 'Register'}
    </button>
  );
};

export default EventRegistrationButton;