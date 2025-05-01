// Add these types to your types/index.ts file

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  logo?: string;
  website?: string;
}

export type EventType = 'hackathon' | 'tech-talk' | 'workshop' | 'conference' | 'other';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  time: string;
  type: EventType;
  college?: College;
  location: string;
  is_virtual: boolean;
  link: string;
  image_url?: string;
  registration_deadline?: string;
  organizer?: string;
  event_tags?: { tag: string }[];
  featured?: boolean;
  is_paid: boolean;
  price: number;
  max_participants?: number;
  current_participants: number;
  created_at: string;
  updated_at: string;
}