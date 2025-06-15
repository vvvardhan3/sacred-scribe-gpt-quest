
-- Update the subscribers table to work with Razorpay
ALTER TABLE public.subscribers 
RENAME COLUMN stripe_customer_id TO razorpay_customer_id;

-- Add Razorpay-specific columns
ALTER TABLE public.subscribers 
ADD COLUMN razorpay_subscription_id TEXT,
ADD COLUMN plan_id TEXT;
