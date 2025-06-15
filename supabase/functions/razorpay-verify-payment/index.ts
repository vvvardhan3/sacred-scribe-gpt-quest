
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
    console.log('=== Payment Verification Started ===')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestBody = await req.json()
    console.log('Verification request received:', requestBody)

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature 
    } = requestBody

    console.log('Verifying payment:', {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      signature_present: !!razorpay_signature
    })

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

    console.log('Signature verification:', {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature
    })

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch!')
      throw new Error('Invalid payment signature')
    }

    console.log('Payment signature verified successfully')

    // Get subscription details for payment record
    console.log('Fetching subscription details for order:', razorpay_order_id)
    
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscribers')
      .select('user_id, plan_id, subscription_tier')
      .eq('razorpay_subscription_id', razorpay_order_id)
      .single()

    if (subscriptionError || !subscriptionData) {
      console.error('Subscription lookup error:', subscriptionError)
      throw new Error('Subscription not found for this payment')
    }

    console.log('Found subscription:', subscriptionData)

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
        console.log('Order details fetched:', { amount: orderAmount, currency: orderCurrency })
      }
    } catch (error) {
      console.log('Could not fetch order details, using defaults:', error.message)
    }

    // Store payment details in payments table
    console.log('Storing payment details...')
    
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

    console.log('Payment details stored successfully:', paymentData.id)

    // Update subscription status in database
    console.log('Updating subscription status for order:', razorpay_order_id)
    
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

    console.log('Database update result:', updateData)

    if (!updateData || updateData.length === 0) {
      console.error('No subscription found for order:', razorpay_order_id)
      throw new Error('Subscription not found for this payment')
    }

    console.log('Subscription activated successfully for user:', updateData[0].user_id)

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
    console.error('=== Payment Verification Error ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
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
