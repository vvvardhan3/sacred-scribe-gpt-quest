
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

    // Update subscription status in database using order_id
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
        subscription: updateData[0]
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
