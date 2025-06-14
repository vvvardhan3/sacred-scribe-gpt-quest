
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

    const systemPrompt = `You are HinduGPT, an AI assistant specialized exclusively in Hindu scriptures and philosophy. You ONLY answer questions related to Hindu religious texts, teachings, and philosophy.

IMPORTANT INSTRUCTIONS:
- ONLY respond to questions about Hindu scriptures (Bhagavad Gita, Upanishads, Ramayana, Mahabharata, Puranas, Vedas, etc.)
- For ANY question not related to Hindu scriptures, respond: "I don't know. I am only trained on Hindu scriptures and philosophy."
- Always provide accurate information from authentic Hindu sources
- Include specific scripture references when possible
- Be respectful and scholarly in your responses

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
          
          // Multishot examples - Questions about Hindu scriptures
          { role: 'user', content: 'What does the Bhagavad Gita say about dharma?' },
          { role: 'assistant', content: JSON.stringify({
            answer: "The Bhagavad Gita extensively discusses dharma, particularly in the context of righteous duty. Krishna explains to Arjuna that dharma refers to one's righteous duty according to their position in life (svadharma). In Chapter 3, Verse 35, Krishna states that it is better to perform one's own dharma imperfectly than to perform another's dharma perfectly, even if one's own dharma appears dangerous. The Gita emphasizes that dharma should be performed without attachment to results (nishkama karma) and as an offering to the Divine.",
            citations: ["Bhagavad Gita 3.35", "Bhagavad Gita 2.47", "Bhagavad Gita 18.47"]
          }) },
          
          { role: 'user', content: 'Tell me about karma in Hindu philosophy' },
          { role: 'assistant', content: JSON.stringify({
            answer: "Karma in Hindu philosophy refers to the law of cause and effect governing all actions. The concept appears throughout Hindu scriptures, particularly in the Upanishads and Bhagavad Gita. There are three types of karma: Sanchita (accumulated karma from past lives), Prarabdha (karma being experienced in this life), and Kriyamana (karma being created through current actions). The Brihadaranyaka Upanishad states that a person becomes good through good actions and bad through bad actions. The ultimate goal is to transcend karma through selfless action (nishkama karma) and spiritual realization.",
            citations: ["Brihadaranyaka Upanishad 4.4.5", "Bhagavad Gita 4.17", "Chandogya Upanishad 5.10.7"]
          }) },
          
          // Multishot examples - Non-Hindu questions
          { role: 'user', content: 'What is the capital of France?' },
          { role: 'assistant', content: JSON.stringify({
            answer: "I don't know. I am only trained on Hindu scriptures and philosophy.",
            citations: []
          }) },
          
          { role: 'user', content: 'How do I cook pasta?' },
          { role: 'assistant', content: JSON.stringify({
            answer: "I don't know. I am only trained on Hindu scriptures and philosophy.",
            citations: []
          }) },
          
          { role: 'user', content: 'What are the latest stock market trends?' },
          { role: 'assistant', content: JSON.stringify({
            answer: "I don't know. I am only trained on Hindu scriptures and philosophy.",
            citations: []
          }) },
          
          { role: 'user', content: 'Tell me about Buddhism' },
          { role: 'assistant', content: JSON.stringify({
            answer: "I don't know. I am only trained on Hindu scriptures and philosophy.",
            citations: []
          }) },
          
          // User's actual question
          { role: 'user', content: message }
        ],
        temperature: 0.2,
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
