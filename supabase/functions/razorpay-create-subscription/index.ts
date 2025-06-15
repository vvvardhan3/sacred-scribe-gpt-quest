
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
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    let requestBody
    try {
      const bodyText = await req.text()
      console.log('Raw request body:', bodyText)
      requestBody = JSON.parse(bodyText)
      console.log('Parsed request body:', requestBody)
    } catch (error) {
      console.error('Failed to parse request body:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body - must be valid JSON',
          details: error.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const { planId, userId } = requestBody
    console.log('Creating subscription for user:', userId, 'plan:', planId)

    if (!planId || !userId) {
      console.error('Missing required parameters:', { planId, userId })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: planId and userId are required',
          received: { planId, userId }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get user data
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header present:', !!authHeader)
    
    if (!authHeader) {
      console.error('No authorization header provided')
      return new Response(
        JSON.stringify({ 
          error: 'No authorization header provided',
          details: 'Authorization header is required'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Token extracted, length:', token.length)

    let user
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
      
      if (authError) {
        console.error('Auth error:', authError)
        return new Response(
          JSON.stringify({ 
            error: `Authentication failed: ${authError.message}`,
            details: 'Invalid or expired authentication token'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }

      if (!authUser) {
        console.error('No user found after auth')
        return new Response(
          JSON.stringify({ 
            error: 'User not authenticated',
            details: 'No user found with the provided token'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }

      user = authUser
      console.log('User authenticated successfully:', user.id)
    } catch (error) {
      console.error('Authentication exception:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed',
          details: error.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    const razorpayKeyId = 'rzp_test_hDWzj3XChB3yxM'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'Razorpay configuration missing',
          details: 'RAZORPAY_KEY_SECRET environment variable not set'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
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
      return new Response(
        JSON.stringify({ 
          error: 'Invalid plan selected',
          details: `Plan '${planId}' not found. Available plans: ${Object.keys(plans).join(', ')}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
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
        user_email: user.email || '',
        plan_type: planId,
        plan_name: selectedPlan.name
      }
    }

    console.log('Order payload:', JSON.stringify(orderPayload, null, 2))

    let orderResponse
    try {
      orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authBasic}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      })

      console.log('Razorpay order response status:', orderResponse.status)
      console.log('Razorpay order response headers:', Object.fromEntries(orderResponse.headers.entries()))
    } catch (error) {
      console.error('Network error calling Razorpay:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Network error calling Razorpay',
          details: error.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text()
      console.error('Razorpay order creation failed:', errorData)
      console.error('Status:', orderResponse.status)
      console.error('Status text:', orderResponse.statusText)
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to create order with Razorpay`,
          details: errorData,
          status: orderResponse.status,
          statusText: orderResponse.statusText
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    let order
    try {
      order = await orderResponse.json()
      console.log('Razorpay order created successfully:', order.id)
      console.log('Order details:', JSON.stringify(order, null, 2))
    } catch (error) {
      console.error('Failed to parse Razorpay response:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse Razorpay response',
          details: error.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Store subscription info in database (as pending until payment is verified)
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

    try {
      const { error: insertError } = await supabase
        .from('subscribers')
        .upsert(dbPayload, { onConflict: 'email' })

      if (insertError) {
        console.error('Database insert error:', insertError)
        return new Response(
          JSON.stringify({ 
            error: `Failed to store subscription data: ${insertError.message}`,
            details: insertError
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        )
      }

      console.log('Subscription stored in database successfully')
    } catch (error) {
      console.error('Database operation failed:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Database operation failed',
          details: error.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

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
    console.error('=== Unexpected Error in razorpay-create-subscription ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error name:', error.name)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: 'Check edge function logs for more details',
        stack: error.stack,
        name: error.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
