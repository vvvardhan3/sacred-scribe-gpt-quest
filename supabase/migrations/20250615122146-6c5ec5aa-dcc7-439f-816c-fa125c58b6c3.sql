
-- Create a table to track user usage limits and current usage
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  messages_sent_today INTEGER NOT NULL DEFAULT 0,
  messages_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quizzes_created_total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own usage
CREATE POLICY "Users can view their own usage" 
  ON public.user_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for edge functions to update usage
CREATE POLICY "Edge functions can update usage" 
  ON public.user_usage 
  FOR ALL 
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX idx_user_usage_user_id ON public.user_usage(user_id);

-- Create function to get or create user usage record
CREATE OR REPLACE FUNCTION public.get_or_create_user_usage(p_user_id UUID)
RETURNS TABLE(
  user_id UUID,
  messages_sent_today INTEGER,
  messages_reset_date DATE,
  quizzes_created_total INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to get existing record
  RETURN QUERY
  SELECT 
    uu.user_id,
    uu.messages_sent_today,
    uu.messages_reset_date,
    uu.quizzes_created_total
  FROM public.user_usage uu
  WHERE uu.user_id = p_user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_usage (user_id)
    VALUES (p_user_id);
    
    RETURN QUERY
    SELECT 
      uu.user_id,
      uu.messages_sent_today,
      uu.messages_reset_date,
      uu.quizzes_created_total
    FROM public.user_usage uu
    WHERE uu.user_id = p_user_id;
  END IF;
END;
$$;

-- Create function to reset daily message count if needed
CREATE OR REPLACE FUNCTION public.reset_daily_messages_if_needed(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_usage
  SET 
    messages_sent_today = 0,
    messages_reset_date = CURRENT_DATE,
    updated_at = now()
  WHERE user_id = p_user_id 
    AND messages_reset_date < CURRENT_DATE;
END;
$$;
