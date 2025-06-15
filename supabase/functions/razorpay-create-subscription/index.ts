
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
        interval: 1,
        razorpay_plan_id: 'plan_devotee_monthly_999'
      },
      'guru': {
        name: 'Guru Plan', 
        amount: 299900, // ₹2999 in paise
        period: 'monthly',
        interval: 1,
        razorpay_plan_id: 'plan_guru_monthly_2999'
      }
    }

    const selectedPlan = plans[planId as keyof typeof plans]
    if (!selectedPlan) {
      throw new Error('Invalid plan selected')
    }

    const razorpayKeyId = 'rzp_test_hDWzj3XChB3yxM'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured')
    }

    console.log('Using Razorpay Key ID:', razorpayKeyId)
    const authHeader = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    // First, create/ensure the plan exists in Razorpay
    console.log('Creating/checking plan in Razorpay...')
    const planResponse = await fetch('https://api.razorpay.com/v1/plans', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedPlan.razorpay_plan_id,
        item: {
          name: selectedPlan.name,
          amount: selectedPlan.amount,
          currency: 'INR'
        },
        period: selectedPlan.period,
        interval: selectedPlan.interval,
        notes: {
          plan_type: planId
        }
      })
    })

    // If plan creation fails because it already exists, that's fine
    if (!planResponse.ok) {
      const planErrorData = await planResponse.text()
      console.log('Plan creation response:', planErrorData)
      // If it's not a "plan already exists" error, we might have an issue
      if (!planErrorData.includes('already exists') && !planErrorData.includes('BAD_REQUEST_ERROR')) {
        console.error('Plan creation failed:', planErrorData)
      }
    } else {
      const planData = await planResponse.json()
      console.log('Plan created/verified:', planData.id)
    }

    // Now create the subscription using the plan
    console.log('Creating subscription with plan:', selectedPlan.razorpay_plan_id)
    const subscriptionResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: selectedPlan.razorpay_plan_id,
        customer_notify: 1,
        quantity: 1,
        total_count: 12, // 12 months
        start_at: Math.floor(Date.now() / 1000) + 300, // Start 5 minutes from now
        notes: {
          user_id: user.id,
          user_email: user.email,
          plan_type: planId
        }
      })
    })

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.text()
      console.error('Razorpay subscription creation failed:', errorData)
      throw new Error(`Failed to create subscription with Razorpay: ${errorData}`)
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
