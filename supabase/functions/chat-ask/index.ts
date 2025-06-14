
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Processing chat message: ${message}`);

    // For now, we'll use GPT-4o-mini directly. In production, you'd:
    // 1. Embed the user's question
    // 2. Search Pinecone for relevant scripture passages
    // 3. Use those passages as context for the AI response
    
    const systemPrompt = `You are a knowledgeable assistant specializing in Hindu scriptures and philosophy. 
    Answer questions based on authentic Hindu texts like the Bhagavad Gita, Upanishads, Ramayana, Mahabharata, Puranas, and Vedas.
    
    Always:
    - Provide accurate information from authentic sources
    - Include specific scripture references when possible
    - Be respectful and scholarly in your responses
    - If uncertain, acknowledge limitations rather than speculate
    
    Format your response as JSON:
    {
      "answer": "Your detailed response here",
      "citations": ["Scripture reference 1", "Scripture reference 2"]
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('OpenAI response:', content);
    
    let responseData;
    try {
      responseData = JSON.parse(content);
    } catch (e) {
      // Fallback if response isn't JSON
      responseData = {
        answer: content,
        citations: []
      };
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-ask function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        answer: "I apologize, but I'm unable to process your request at the moment. Please try again later.",
        citations: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
