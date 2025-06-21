
-- Enable Row Level Security on tables and create admin policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create admin policies for profiles
CREATE POLICY "Admin can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Create admin policies for messages
CREATE POLICY "Admin can view all messages" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Create admin policies for feedback
CREATE POLICY "Admin can view all feedback" ON public.feedback
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admin can update feedback" ON public.feedback
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admin can delete feedback" ON public.feedback
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Create admin policies for subscribers
CREATE POLICY "Admin can view all subscribers" ON public.subscribers
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- Enable realtime for admin dashboard
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.feedback REPLICA IDENTITY FULL;
ALTER TABLE public.subscribers REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.profiles;
ALTER publication supabase_realtime ADD TABLE public.messages;
ALTER publication supabase_realtime ADD TABLE public.feedback;
ALTER publication supabase_realtime ADD TABLE public.subscribers;

-- Create function to get total message count
CREATE OR REPLACE FUNCTION get_total_message_count()
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM public.messages;
$$;

-- Create function to get subscriber counts by plan
CREATE OR REPLACE FUNCTION get_subscriber_counts()
RETURNS TABLE(
  devotee_count BIGINT,
  guru_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*) FILTER (WHERE plan_id = 'devotee' AND subscribed = true) as devotee_count,
    COUNT(*) FILTER (WHERE plan_id = 'guru' AND subscribed = true) as guru_count
  FROM public.subscribers;
$$;
