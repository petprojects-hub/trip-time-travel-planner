
-- Create a table for travel destinations
CREATE TABLE public.travel_places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  days INTEGER NOT NULL CHECK (days > 0),
  months TEXT[] NOT NULL CHECK (array_length(months, 1) > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for planner data (assigned destinations to vacation slots)
CREATE TABLE public.planner_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  vacation_type TEXT NOT NULL,
  place_id UUID REFERENCES public.travel_places(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, vacation_type)
);

-- Add some initial data based on your current destinations
INSERT INTO public.travel_places (name, days, months) VALUES 
  ('Kazakhstan + Uzbekistan', 14, ARRAY['May']),
  ('Egypt', 9, ARRAY['March', 'October']),
  ('Varanasi', 4, ARRAY['March', 'December']),
  ('Singapore + Malaysia', 9, ARRAY['March', 'May', 'October']),
  ('Maldives + Sri Lanka', 14, ARRAY['March']),
  ('Hyderabad', 4, ARRAY['March', 'December']),
  ('Georgia + Azerbaijan', 14, ARRAY['March', 'May']),
  ('Dubai', 5, ARRAY['March']),
  ('Iceland', 9, ARRAY['October']),
  ('Kedarnath', 9, ARRAY['May']),
  ('Nepal', 6, ARRAY['October']),
  ('Vietnam', 9, ARRAY['December', 'March']),
  ('China', 9, ARRAY['March', 'October']),
  ('Bhutan', 9, ARRAY['March', 'October']);
