
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Generating quiz for category: ${category}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate questions using OpenAI
    const prompt = `Generate 10 multiple-choice questions about ${category} from Hindu scriptures. 
    Each question should:
    - Test knowledge of key concepts, verses, or teachings
    - Have 4 options (A, B, C, D)
    - Include the correct answer
    - Provide a brief explanation with scripture reference
    
    Return ONLY valid JSON in this exact format without any markdown formatting:
    {
      "questions": [
        {
          "question": "Question text here?",
          "choices": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "answer": "A",
          "explanation": "Explanation with scripture reference"
        }
      ]
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
          { 
            role: 'system', 
            content: 'You are an expert on Hindu scriptures. Generate accurate quiz questions with proper citations from authentic texts. Return ONLY valid JSON without any markdown formatting or code blocks.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    console.log('OpenAI response:', content);
    
    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
    
    let questionsData;
    try {
      questionsData = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI');
    }

    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Invalid questions format from OpenAI');
    }

    // Create quiz in database
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: `${category} Quiz - ${new Date().toLocaleDateString()}`,
        category: category,
        description: `Test your knowledge of ${category} with these scripture-based questions`
      })
      .select()
      .single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      throw quizError;
    }

    console.log('Created quiz:', quiz);

    // Insert questions
    const questionsToInsert = questionsData.questions.map((q: any) => ({
      quiz_id: quiz.id,
      text: q.question,
      choices: q.choices,
      answer: q.answer,
      explanation: q.explanation
    }));

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error('Error creating questions:', questionsError);
      throw questionsError;
    }

    console.log(`Successfully created ${questionsToInsert.length} questions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        quiz: quiz,
        questionsCount: questionsToInsert.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in quiz-generate function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
