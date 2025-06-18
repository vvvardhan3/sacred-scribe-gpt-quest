
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

    // Reset daily messages if needed first
    await supabase.rpc('reset_daily_messages_if_needed', { p_user_id: user.id })

    // Get current usage
    const { data: currentUsage, error: fetchError } = await supabase
      .from('user_usage')
      .select('messages_sent_today')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching current usage:', fetchError)
      throw new Error('Failed to fetch current usage')
    }

    const currentCount = currentUsage?.messages_sent_today || 0

    // Increment message count using proper SQL increment
    const { error: updateError } = await supabase
      .from('user_usage')
      .upsert({
        user_id: user.id,
        messages_sent_today: currentCount + 1,
        messages_reset_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (updateError) {
      console.error('Error incrementing message count:', updateError)
      throw new Error('Failed to increment message count')
    }

    return new Response(
      JSON.stringify({ success: true, new_count: currentCount + 1 }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in increment-message-count:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
