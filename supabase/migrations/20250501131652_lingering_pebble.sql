/*
  # Add Event Registration Support

  1. New Tables
    - `event_registrations`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references auth.users)
      - `status` (enum: pending, confirmed, cancelled)
      - `payment_id` (text, for paid events)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to Events Table
    - Add `is_paid` (boolean)
    - Add `price` (integer, in cents)
    - Add `max_participants` (integer)
    - Add `current_participants` (integer)

  3. Security
    - Enable RLS on event_registrations
    - Add policies for viewing and creating registrations
*/

-- Add event registration status enum
CREATE TYPE event_registration_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled'
);

-- Add new columns to events table
ALTER TABLE events 
  ADD COLUMN is_paid boolean DEFAULT false,
  ADD COLUMN price integer DEFAULT 0,
  ADD COLUMN max_participants integer DEFAULT null,
  ADD COLUMN current_participants integer DEFAULT 0;

-- Create event registrations table
CREATE TABLE event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  status event_registration_status DEFAULT 'pending',
  payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create registrations"
  ON event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create function to update current_participants count
CREATE OR REPLACE FUNCTION update_event_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE events 
    SET current_participants = current_participants + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
    UPDATE events 
    SET current_participants = current_participants + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
    UPDATE events 
    SET current_participants = current_participants - 1
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating participants count
CREATE TRIGGER update_event_participants_trigger
  AFTER INSERT OR UPDATE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_participants();