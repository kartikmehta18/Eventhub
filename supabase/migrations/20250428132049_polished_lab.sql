/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (date)
      - `end_date` (date)
      - `time` (time)
      - `type` (text)
      - `location` (text)
      - `is_virtual` (boolean)
      - `link` (text)
      - `image_url` (text)
      - `registration_deadline` (date)
      - `organizer` (text)
      - `created_by` (uuid, references auth.users)
      - `college_id` (uuid)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `featured` (boolean)

    - `event_tags`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `tag` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  end_date date,
  time time NOT NULL,
  type text NOT NULL,
  location text NOT NULL,
  is_virtual boolean DEFAULT false,
  link text NOT NULL,
  image_url text,
  registration_deadline date,
  organizer text,
  created_by uuid REFERENCES auth.users,
  college_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  featured boolean DEFAULT false
);

-- Create event_tags table
CREATE TABLE public.event_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events ON DELETE CASCADE,
  tag text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Events are viewable by everyone"
  ON public.events
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own events"
  ON public.events
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Event tags are viewable by everyone"
  ON public.event_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create event tags"
  ON public.event_tags
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes
CREATE INDEX events_date_idx ON public.events (date);
CREATE INDEX events_type_idx ON public.events (type);
CREATE INDEX events_college_id_idx ON public.events (college_id);
CREATE INDEX event_tags_tag_idx ON public.event_tags (tag);