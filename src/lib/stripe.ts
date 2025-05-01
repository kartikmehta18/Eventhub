import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with proper error handling
const stripePromise = (() => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.error('Stripe publishable key is not set');
    return null;
  }
  return loadStripe(publishableKey);
})();

interface CheckoutOptions {
  eventId: string;
  price: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export const redirectToCheckout = async (options: CheckoutOptions): Promise<void> => {
  try {
    if (!stripePromise) {
      throw new Error('Stripe is not properly initialized');
    }

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    // Create a Checkout Session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId: options.eventId,
        price: options.price,
        successUrl: options.successUrl,
        cancelUrl: options.cancelUrl,
        metadata: options.metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};