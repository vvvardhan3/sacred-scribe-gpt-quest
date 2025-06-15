
-- Create a table for contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to insert their own submissions
CREATE POLICY "Users can create contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true); -- Allow anyone to submit contact forms

-- Create policy for authenticated users to view their own submissions
CREATE POLICY "Users can view their own contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create policy for admins to view all submissions (you can adjust this based on your admin setup)
CREATE POLICY "Admins can view all contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));
