
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log('Generating title for message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Create a concise 6-word or less title that captures the main topic of the user\'s message. Be specific and descriptive. Only return the title, nothing else.' 
          },
          { role: 'user', content: message }
        ],
        max_tokens: 20,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const title = data.choices[0].message.content.trim();

    console.log('Generated title:', title);

    return new Response(JSON.stringify({ title }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating title:', error);
    // Fallback to simple truncation
    const { message } = await req.json();
    const fallbackTitle = message.slice(0, 30) + (message.length > 30 ? '...' : '');
    
    return new Response(JSON.stringify({ title: fallbackTitle }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
