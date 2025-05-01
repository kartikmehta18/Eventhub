import { supabase } from '../lib/supabase';

interface CreateRegistrationParams {
  eventId: string;
  userId: string;
  status: 'pending' | 'registered';
}

export const createEventRegistration = async ({ eventId, userId, status }: CreateRegistrationParams) => {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          status,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data };
  } catch (error) {
    console.error('Error creating event registration:', error);
    throw error;
  }
};

export const checkExistingRegistration = async (eventId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }

    return { exists: !!data, data };
  } catch (error) {
    console.error('Error checking existing registration:', error);
    throw error;
  }
}; 