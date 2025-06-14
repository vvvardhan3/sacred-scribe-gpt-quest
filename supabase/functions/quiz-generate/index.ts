
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
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Generating quiz for category: ${category}`);

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check existing quizzes to get context for generating unique questions
    const { data: existingQuizzes, error: fetchError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('category', category);

    if (fetchError) {
      console.error('Error fetching existing quizzes:', fetchError);
      throw fetchError;
    }

    const quizNumber = (existingQuizzes?.length || 0) + 1;
    const timestamp = new Date().toISOString();

    console.log(`This will be quiz #${quizNumber} for category ${category}`);

    // Generate questions using OpenAI with more specific prompts for uniqueness
    const prompt = `Generate 10 unique multiple-choice questions about ${category} from Hindu scriptures for Quiz #${quizNumber}. 
    
    IMPORTANT: Make these questions DIFFERENT from any previous quizzes. Focus on these aspects:
    - Explore different texts, chapters, and verses within ${category}
    - Include questions about different characters, events, and teachings
    - Vary the difficulty levels (basic, intermediate, advanced)
    - Cover diverse themes like philosophy, stories, moral lessons, and historical context
    - Ask about specific verses, their meanings, and interpretations
    
    Current timestamp: ${timestamp}
    
    Each question should:
    - Test unique knowledge of ${category} concepts, verses, or teachings
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

    console.log('Making request to OpenAI...');

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
            content: `You are an expert on Hindu scriptures with deep knowledge of ${category}. Generate unique, diverse quiz questions that cover different aspects and avoid repetition. Each quiz should explore different facets of the scripture. Return ONLY valid JSON without any markdown formatting or code blocks.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8, // Increased for more variety
        max_tokens: 3000,
        presence_penalty: 0.6, // Encourage diverse content
        frequency_penalty: 0.4, // Reduce repetition
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    let content = data.choices[0].message.content;
    console.log('Raw OpenAI response:', content);
    
    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
    
    let questionsData;
    try {
      questionsData = JSON.parse(content);
      console.log('Successfully parsed JSON response');
    } catch (e) {
      console.error('Failed to parse OpenAI response:', content);
      console.error('Parse error:', e);
      throw new Error(`Invalid response format from OpenAI: ${e.message}`);
    }

    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      console.error('Invalid questions format:', questionsData);
      throw new Error('Invalid questions format from OpenAI - missing questions array');
    }

    if (questionsData.questions.length === 0) {
      console.error('No questions generated');
      throw new Error('No questions were generated by OpenAI');
    }

    console.log(`Generated ${questionsData.questions.length} questions`);

    // Create quiz in database with more descriptive title
    const quizTitle = `${category} Quiz #${quizNumber} - ${new Date().toLocaleDateString()}`;
    console.log('Creating quiz in database...');
    
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: quizTitle,
        category: category,
        description: `Test your knowledge of ${category} with these unique scripture-based questions`
      })
      .select()
      .single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      throw new Error(`Database error creating quiz: ${quizError.message}`);
    }

    console.log('Quiz created successfully:', quiz.id);

    // Insert questions
    const questionsToInsert = questionsData.questions.map((q: any, index: number) => {
      // Validate question structure
      if (!q.question || !q.choices || !Array.isArray(q.choices) || !q.answer || !q.explanation) {
        console.error(`Invalid question structure at index ${index}:`, q);
        throw new Error(`Invalid question structure at index ${index}`);
      }
      
      return {
        quiz_id: quiz.id,
        text: q.question,
        choices: q.choices,
        answer: q.answer,
        explanation: q.explanation
      };
    });

    console.log('Inserting questions...');
    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error('Error creating questions:', questionsError);
      // Try to clean up the quiz if question insertion fails
      await supabase.from('quizzes').delete().eq('id', quiz.id);
      throw new Error(`Database error creating questions: ${questionsError.message}`);
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
