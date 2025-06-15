
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { planId, userId } = await req.json()
    console.log('Creating subscription for user:', userId, 'plan:', planId)

    // Get user data
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
    )

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    // Plan configurations
    const plans = {
      'devotee': {
        name: 'Devotee Plan',
        amount: 99900, // ₹999 in paise
        period: 'monthly',
        interval: 1
      },
      'guru': {
        name: 'Guru Plan', 
        amount: 299900, // ₹2999 in paise
        period: 'monthly',
        interval: 1
      }
    }

    const selectedPlan = plans[planId as keyof typeof plans]
    if (!selectedPlan) {
      throw new Error('Invalid plan selected')
    }

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured')
    }

    // Create Razorpay subscription
    const subscriptionResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(razorpayKeySecret + ':')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId,
        customer_notify: 1,
        quantity: 1,
        total_count: 12, // 12 months
        start_at: Math.floor(Date.now() / 1000) + 300, // Start 5 minutes from now
        notes: {
          user_id: user.id,
          user_email: user.email
        }
      })
    })

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.text()
      console.error('Razorpay subscription creation failed:', errorData)
      throw new Error('Failed to create subscription')
    }

    const subscription = await subscriptionResponse.json()
    console.log('Razorpay subscription created:', subscription.id)

    // Store subscription info in database
    const { error: insertError } = await supabase
      .from('subscribers')
      .upsert({
        user_id: user.id,
        email: user.email!,
        razorpay_subscription_id: subscription.id,
        plan_id: planId,
        subscription_tier: selectedPlan.name,
        subscribed: false, // Will be true after payment confirmation
        updated_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error('Failed to store subscription data')
    }

    return new Response(
      JSON.stringify({ 
        subscription_id: subscription.id,
        amount: selectedPlan.amount,
        plan_name: selectedPlan.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error creating subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
