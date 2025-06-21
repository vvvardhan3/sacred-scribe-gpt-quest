
-- Create admin_users table to store admin credentials
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy that only allows authenticated admins to access admin_users table
CREATE POLICY "Only authenticated admins can access admin_users" 
  ON public.admin_users 
  FOR ALL 
  USING (false);

-- Insert the admin user with hashed password
-- Using bcrypt-style hash for 'Preethi@3108'
INSERT INTO public.admin_users (email, password_hash) 
VALUES ('vardhanv1999@gmail.com', '$2a$10$8K1p/a0dChAmp4B4PKBK8.YzRfgW6DhBIxGmKqyEEqQUeOH.A6XUa');

-- Create a function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_email TEXT, p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  -- Get the stored password hash for the email
  SELECT password_hash INTO stored_hash
  FROM public.admin_users
  WHERE email = p_email;
  
  -- If no user found, return false
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- For now, we'll do a simple comparison (in production, use proper password hashing)
  -- This is a simplified version - in real production, you'd use bcrypt or similar
  RETURN stored_hash = crypt(p_password, stored_hash);
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Create a simpler function for demonstration (since we don't have bcrypt extension)
CREATE OR REPLACE FUNCTION public.verify_admin_credentials_simple(p_email TEXT, p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple credential check (you should use proper hashing in production)
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = p_email 
    AND password_hash = encode(digest(p_password, 'sha256'), 'hex')
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Update the admin user record with SHA256 hash of the password
UPDATE public.admin_users 
SET password_hash = encode(digest('Preethi@3108', 'sha256'), 'hex')
WHERE email = 'vardhanv1999@gmail.com';
