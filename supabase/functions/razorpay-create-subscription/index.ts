
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

    const razorpayKeyId = 'rzp_test_hDWzj3XChB3yxM'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not found in environment')
      throw new Error('Razorpay key secret not configured')
    }

    console.log('Razorpay credentials configured')
    const authBasic = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    // Plan configurations with amounts for order creation
    const plans = {
      'devotee': {
        name: 'Devotee Plan',
        amount: 99900, // ₹999 in paise
        currency: 'INR'
      },
      'guru': {
        name: 'Guru Plan', 
        amount: 299900, // ₹2999 in paise
        currency: 'INR'
      }
    }

    const selectedPlan = plans[planId as keyof typeof plans]
    if (!selectedPlan) {
      console.error('Invalid plan selected:', planId)
      throw new Error('Invalid plan selected')
    }

    console.log('Selected plan:', selectedPlan)

    // Create a simple order instead of subscription for now
    console.log('Creating order with Razorpay...')
    const orderPayload = {
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: user.id,
        user_email: user.email,
        plan_type: planId,
        plan_name: selectedPlan.name
      }
    }

    console.log('Order payload:', JSON.stringify(orderPayload, null, 2))

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBasic}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload)
    })

    console.log('Razorpay order response status:', orderResponse.status)

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text()
      console.error('Razorpay order creation failed:', errorData)
      throw new Error(`Failed to create order with Razorpay (${orderResponse.status}): ${errorData}`)
    }

    const order = await orderResponse.json()
    console.log('Razorpay order created successfully:', order.id)

    // Store subscription info in database
    const dbPayload = {
      user_id: user.id,
      email: user.email!,
      razorpay_subscription_id: order.id, // Using order ID for now
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
      subscription_id: order.id,
      amount: selectedPlan.amount,
      plan_name: selectedPlan.name,
      currency: selectedPlan.currency
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
