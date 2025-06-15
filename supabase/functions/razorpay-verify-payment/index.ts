
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

    const { 
      razorpay_payment_id, 
      razorpay_subscription_id, 
      razorpay_signature 
    } = await req.json()

    console.log('Verifying payment:', razorpay_payment_id, razorpay_subscription_id)

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured')
    }

    // Verify signature
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid signature')
    }

    console.log('Payment signature verified successfully')

    // Update subscription status in database
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({
        subscribed: true,
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', razorpay_subscription_id)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error('Failed to update subscription status')
    }

    console.log('Subscription activated successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified and subscription activated' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
