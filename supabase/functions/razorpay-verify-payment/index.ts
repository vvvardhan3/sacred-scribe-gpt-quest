
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts"

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

    const requestBody = await req.json()

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature 
    } = requestBody

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      throw new Error('Missing required payment verification parameters')
    }

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured')
    }

    // Verify signature for order payment
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch!')
      throw new Error('Invalid payment signature')
    }

    // Get subscription details for payment record
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscribers')
      .select('user_id, plan_id, subscription_tier')
      .eq('razorpay_subscription_id', razorpay_order_id)
      .single()

    if (subscriptionError || !subscriptionData) {
      console.error('Subscription lookup error:', subscriptionError)
      throw new Error('Subscription not found for this payment')
    }

    // Get order details from Razorpay (optional, but useful for amount verification)
    const razorpayKeyId = 'rzp_test_hDWzj3XChB3yxM'
    const authBasic = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    let orderAmount = 0
    let orderCurrency = 'INR'
    
    try {
      const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
        headers: {
          'Authorization': `Basic ${authBasic}`,
        }
      })

      if (orderResponse.ok) {
        const orderData = await orderResponse.json()
        orderAmount = orderData.amount
        orderCurrency = orderData.currency
      }
    } catch (error) {
      // Order details fetch failed, continue with defaults
    }

    // Store payment details in payments table
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: subscriptionData.user_id,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        amount: orderAmount,
        currency: orderCurrency,
        status: 'captured',
        plan_id: subscriptionData.plan_id,
        plan_name: subscriptionData.subscription_tier || 'Unknown Plan'
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment storage error:', paymentError)
      throw new Error(`Failed to store payment details: ${paymentError.message}`)
    }

    // Update subscription status in database
    const { data: updateData, error: updateError } = await supabase
      .from('subscribers')
      .update({
        subscribed: true,
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', razorpay_order_id)
      .select()

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error(`Failed to update subscription status: ${updateError.message}`)
    }

    if (!updateData || updateData.length === 0) {
      console.error('No subscription found for order:', razorpay_order_id)
      throw new Error('Subscription not found for this payment')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified and subscription activated',
        subscription: updateData[0],
        payment: paymentData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Payment verification failed:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Payment verification failed. Check edge function logs for details.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
