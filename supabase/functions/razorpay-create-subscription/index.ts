
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
    console.log('=== Razorpay Create Subscription Function Started ===')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    let requestBody
    try {
      requestBody = await req.json()
      console.log('Request body received:', requestBody)
    } catch (error) {
      console.error('Failed to parse request body:', error)
      throw new Error('Invalid request body')
    }

    const { planId, userId } = requestBody
    console.log('Creating subscription for user:', userId, 'plan:', planId)

    if (!planId || !userId) {
      console.error('Missing required parameters:', { planId, userId })
      throw new Error('Missing required parameters: planId and userId')
    }

    // Get user data
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header present:', !!authHeader)
    
    if (!authHeader) {
      throw new Error('No authorization header provided')
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Token extracted, length:', token.length)

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    if (!user) {
      console.error('No user found')
      throw new Error('User not authenticated')
    }

    console.log('User authenticated successfully:', user.id)

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
      console.error('Invalid plan selected:', planId)
      throw new Error('Invalid plan selected')
    }

    console.log('Selected plan:', selectedPlan)

    const razorpayKeyId = 'rzp_test_hDWzj3XChB3yxM'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not found in environment')
      throw new Error('Razorpay key secret not configured')
    }

    console.log('Razorpay credentials configured')
    const authBasic = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    // Create subscription directly (plans are created on Razorpay dashboard)
    console.log('Creating subscription with Razorpay...')
    const subscriptionPayload = {
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
    }

    console.log('Subscription payload:', JSON.stringify(subscriptionPayload, null, 2))

    const subscriptionResponse = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBasic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionPayload)
    })

    console.log('Razorpay response status:', subscriptionResponse.status)

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.text()
      console.error('Razorpay subscription creation failed:', errorData)
      console.error('Response status:', subscriptionResponse.status)
      console.error('Response headers:', Object.fromEntries(subscriptionResponse.headers.entries()))
      throw new Error(`Failed to create subscription with Razorpay (${subscriptionResponse.status}): ${errorData}`)
    }

    const subscription = await subscriptionResponse.json()
    console.log('Razorpay subscription created successfully:', subscription.id)

    // Store subscription info in database
    const dbPayload = {
      user_id: user.id,
      email: user.email!,
      razorpay_subscription_id: subscription.id,
      plan_id: planId,
      subscription_tier: selectedPlan.name,
      subscribed: false, // Will be true after payment confirmation
      updated_at: new Date().toISOString()
    }

    console.log('Storing subscription in database:', dbPayload)

    const { error: insertError } = await supabase
      .from('subscribers')
      .upsert(dbPayload)

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error(`Failed to store subscription data: ${insertError.message}`)
    }

    console.log('Subscription stored in database successfully')

    const responseData = { 
      subscription_id: subscription.id,
      amount: selectedPlan.amount,
      plan_name: selectedPlan.name
    }

    console.log('Returning success response:', responseData)

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('=== Error in razorpay-create-subscription ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check edge function logs for more details'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
