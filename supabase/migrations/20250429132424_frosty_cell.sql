/*
  # Create colleges table

  1. New Tables
    - `colleges`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `website` (text)
      - `logo` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on colleges table
    - Add policy for public read access
    - Add policy for authenticated users to create colleges
*/

CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  website text NOT NULL,
  logo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Colleges are viewable by everyone"
  ON public.colleges
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create colleges"
  ON public.colleges
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX colleges_name_idx ON public.colleges (name);
CREATE INDEX colleges_location_idx ON public.colleges (location);

-- Insert initial colleges
INSERT INTO public.colleges (name, location, website, logo)
VALUES
  ('Stanford University', 'Stanford, CA', 'https://stanford.edu', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg'),
  ('Massachusetts Institute of Technology', 'Cambridge, MA', 'https://mit.edu', 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg'),
  ('UC Berkeley', 'Berkeley, CA', 'https://berkeley.edu', 'https://images.pexels.com/photos/159699/university-of-tampa-college-education-campus-159699.jpeg'),
  ('Harvard University', 'Cambridge, MA', 'https://harvard.edu', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'),
  ('Carnegie Mellon University', 'Pittsburgh, PA', 'https://cmu.edu', 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg');