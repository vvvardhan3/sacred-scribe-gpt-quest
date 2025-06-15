
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
    console.log('=== Get User Usage Function Started ===')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user data
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header provided')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('User not authenticated')
    }

    console.log('User authenticated:', user.id)

    // Reset daily messages if needed
    await supabase.rpc('reset_daily_messages_if_needed', { p_user_id: user.id })

    // Get or create user usage record
    const { data: usageData, error: usageError } = await supabase.rpc('get_or_create_user_usage', { 
      p_user_id: user.id 
    })

    if (usageError) {
      console.error('Error getting usage data:', usageError)
      throw new Error('Failed to get usage data')
    }

    console.log('Usage data retrieved:', usageData)

    // Return the first record from the function result
    const usage = usageData && usageData.length > 0 ? usageData[0] : {
      messages_sent_today: 0,
      quizzes_created_total: 0,
      messages_reset_date: new Date().toISOString().split('T')[0]
    }

    return new Response(
      JSON.stringify(usage),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in get-user-usage:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
