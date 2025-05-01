import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface CreateCheckoutSessionRequest {
  eventId: string;
  price: number;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export const createCheckoutSession = async (req: CreateCheckoutSessionRequest) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Event Registration - ${req.eventId}`,
            },
            unit_amount: req.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: req.successUrl,
      cancel_url: req.cancelUrl,
      metadata: {
        eventId: req.eventId,
        ...req.metadata,
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}; 