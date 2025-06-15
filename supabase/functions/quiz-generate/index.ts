
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define subscription limits and allowed categories
const SUBSCRIPTION_LIMITS = {
  free: {
    maxQuizzes: 1,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads']
  },
  'Devotee Plan': {
    maxQuizzes: 5,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads', 'Mahabharata', 'Bhagavad Gita', 'Ramayana']
  },
  'Guru Plan': {
    maxQuizzes: Infinity,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads', 'Mahabharata', 'Bhagavad Gita', 'Ramayana']
  }
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

    console.log(`Starting quiz generation for category: ${category}`);

    // Create Supabase client with service role key for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      throw new Error('Authorization header is required');
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    console.log('Authorization token received, verifying user...');

    // Verify JWT token using service role client
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('Error getting user:', userError);
      throw new Error('User authentication failed');
    }

    console.log(`User authenticated: ${user.id}`);

    // Get user's subscription details to check limits
    const { data: subscriptionData, error: subError } = await supabase
      .from('subscribers')
      .select('subscribed, subscription_tier')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) {
      console.error('Error fetching subscription:', subError);
    }

    // Determine user's subscription tier
    const subscriptionTier = subscriptionData?.subscribed 
      ? subscriptionData.subscription_tier 
      : 'free';
    
    console.log('User subscription tier:', subscriptionTier);

    // Get subscription limits for this tier
    const userLimits = SUBSCRIPTION_LIMITS[subscriptionTier as keyof typeof SUBSCRIPTION_LIMITS] || SUBSCRIPTION_LIMITS.free;

    // Check if category is allowed for user's subscription
    if (!userLimits.allowedCategories.includes(category)) {
      console.error(`Category ${category} not allowed for ${subscriptionTier} subscription`);
      throw new Error(`Category "${category}" is not available for your subscription plan. Please upgrade to access this category.`);
    }

    // Get user's current quiz count
    const { data: usageData } = await supabase.rpc('get_or_create_user_usage', { 
      p_user_id: user.id 
    });

    const currentQuizCount = usageData && usageData.length > 0 ? usageData[0].quizzes_created_total : 0;

    // Check if user has reached quiz limit
    if (currentQuizCount >= userLimits.maxQuizzes) {
      console.error(`User has reached quiz limit: ${currentQuizCount}/${userLimits.maxQuizzes}`);
      throw new Error(`You have reached your quiz creation limit of ${userLimits.maxQuizzes} for your subscription plan. Please upgrade to create more quizzes.`);
    }

    // Check existing quizzes for this user
    const { data: existingQuizzes, error: fetchError } = await supabase
      .from('quizzes')
      .select('id, title')
      .eq('category', category)
      .eq('user_id', user.id);

    if (fetchError) {
      console.error('Error fetching existing quizzes:', fetchError);
      throw fetchError;
    }

    const quizNumber = (existingQuizzes?.length || 0) + 1;
    console.log(`This will be quiz #${quizNumber} for category ${category} for user ${user.id}`);
    console.log(`Existing quizzes:`, existingQuizzes?.map(q => q.title));

    // Create a simple, focused prompt for OpenAI
    const prompt = `Create 10 multiple-choice questions about ${category} from Hindu scriptures. This is quiz number ${quizNumber}, so make questions different from previous quizzes.

Requirements:
- Each question must have exactly 4 choices labeled A, B, C, D
- Include the correct answer (A, B, C, or D)
- Add a brief explanation with scripture reference
- Make questions unique and cover different aspects of ${category}

Return only valid JSON in this exact format:
{
  "questions": [
    {
      "question": "What is the main teaching of the Bhagavad Gita?",
      "choices": ["A) Devotion to God", "B) Performing duty without attachment", "C) Renunciation of world", "D) Meditation only"],
      "answer": "B",
      "explanation": "The Bhagavad Gita teaches performing one's duty without attachment to results (Karma Yoga)."
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
            content: `You are an expert on Hindu scriptures. Generate quiz questions about ${category}. Return ONLY valid JSON without any markdown formatting, code blocks, or additional text. The response must start with { and end with }.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    let content = data.choices[0].message.content;
    console.log('Raw OpenAI response:', content.substring(0, 200) + '...');
    
    // Clean up the response more aggressively
    content = content.trim();
    
    // Remove any markdown code blocks
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    
    // Remove any leading/trailing text that's not JSON
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No valid JSON found in response:', content);
      throw new Error('OpenAI response does not contain valid JSON');
    }
    
    content = content.substring(jsonStart, jsonEnd + 1);
    console.log('Cleaned JSON:', content.substring(0, 200) + '...');
    
    let questionsData;
    try {
      questionsData = JSON.parse(content);
      console.log('Successfully parsed JSON response');
    } catch (e) {
      console.error('Failed to parse cleaned JSON:', content);
      console.error('Parse error:', e.message);
      throw new Error(`Invalid JSON format: ${e.message}`);
    }

    // Validate the structure
    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      console.error('Invalid structure - missing questions array:', questionsData);
      throw new Error('Response missing questions array');
    }

    if (questionsData.questions.length === 0) {
      console.error('No questions in response');
      throw new Error('No questions generated');
    }

    console.log(`Generated ${questionsData.questions.length} questions`);

    // Validate each question
    for (let i = 0; i < questionsData.questions.length; i++) {
      const q = questionsData.questions[i];
      if (!q.question || !q.choices || !Array.isArray(q.choices) || !q.answer || !q.explanation) {
        console.error(`Invalid question at index ${i}:`, q);
        throw new Error(`Question ${i + 1} is missing required fields`);
      }
      
      if (q.choices.length !== 4) {
        console.error(`Question ${i + 1} doesn't have exactly 4 choices:`, q.choices);
        throw new Error(`Question ${i + 1} must have exactly 4 choices`);
      }
    }

    // Create quiz in database with user_id
    const quizTitle = `${category} Quiz #${quizNumber}`;
    console.log('Creating quiz in database:', quizTitle);
    
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: quizTitle,
        category: category,
        description: `Test your knowledge of ${category} scriptures`,
        user_id: user.id
      })
      .select()
      .single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);
      throw new Error(`Failed to create quiz: ${quizError.message}`);
    }

    console.log('Quiz created successfully:', quiz.id);

    // Insert questions
    const questionsToInsert = questionsData.questions.map((q: any, index: number) => ({
      quiz_id: quiz.id,
      text: q.question,
      choices: q.choices,
      answer: q.answer,
      explanation: q.explanation
    }));

    console.log('Inserting questions...');
    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error('Error creating questions:', questionsError);
      // Clean up the quiz if questions failed
      await supabase.from('quizzes').delete().eq('id', quiz.id);
      throw new Error(`Failed to create questions: ${questionsError.message}`);
    }

    // Increment user's quiz count
    await supabase
      .from('user_usage')
      .upsert({
        user_id: user.id,
        quizzes_created_total: currentQuizCount + 1,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    console.log(`Successfully created ${questionsToInsert.length} questions and incremented quiz count`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        quiz: quiz,
        questionsCount: questionsToInsert.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in quiz-generate function:', error.message);
    console.error('Full error:', error);
    
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
