import { createCheckoutSession } from '../../api/create-checkout-session';

interface Request {
  method: string;
  body: {
    eventId: string;
    price: number;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  };
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => void;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventId, price, successUrl, cancelUrl, metadata } = req.body;

    if (!eventId || !price || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await createCheckoutSession({
      eventId,
      price,
      successUrl,
      cancelUrl,
      metadata,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 