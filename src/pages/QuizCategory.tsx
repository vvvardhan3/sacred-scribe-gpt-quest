import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Trophy, AlertCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserLimits } from '@/hooks/useUserLimits';
import { PreviousQuizzes } from '@/components/quiz/PreviousQuizzes';
import RazorpayPayment from '@/components/RazorpayPayment';

const categories = {
  'vedas': {
    name: 'Vedas',
    description: 'Test your knowledge of the four Vedas - Rig, Sama, Yajur, and Atharva Veda',
    image: '/vedas.jpg',
    color: 'from-orange-500 to-red-600'
  },
  'upanishads': {
    name: 'Upanishads',
    description: 'Explore the philosophical teachings of the principal Upanishads',
    image: '/upanishads.jpg',
    color: 'from-purple-500 to-indigo-600'
  },
  'bhagavad-gita': {
    name: 'Bhagavad Gita',
    description: 'Test your understanding of Krishna\'s teachings to Arjuna',
    image: '/bhagavadgita.png',
    color: 'from-blue-500 to-teal-600'
  },
  'puranas': {
    name: 'Puranas',
    description: 'Challenge yourself with stories and teachings from the Puranas',
    image: '/puranas.jpg',
    color: 'from-green-500 to-emerald-600'
  },
  'mahabharata': {
    name: 'Mahabharata',
    description: 'Test your knowledge of the great epic and its profound teachings',
    image: '/mahabharatha.jpg',
    color: 'from-yellow-500 to-orange-600'
  },
  'ramayana': {
    name: 'Ramayana',
    description: 'Explore the story of Lord Rama and its timeless lessons',
    image: '/Ramayana.jpg',
    color: 'from-pink-500 to-rose-600'
  }
};

// Helper function to normalize category names for URL matching
const normalizeCategoryName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Helper function to find category by URL parameter
const findCategoryByParam = (param: string) => {
  // First try direct match
  if (categories[param as keyof typeof categories]) {
    return categories[param as keyof typeof categories];
  }
  
  // Then try to match by normalized name
  const normalizedParam = param.toLowerCase();
  for (const [key, category] of Object.entries(categories)) {
    if (key === normalizedParam || normalizeCategoryName(category.name) === normalizedParam) {
      return category;
    }
  }
  
  return null;
};

const QuizCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const { canCreateQuiz, usage, limits, incrementQuizCount, isCategoryAllowed } = useUserLimits();

  console.log('Category parameter:', category);
  console.log('Available categories:', Object.keys(categories));

  const categoryData = category ? findCategoryByParam(category) : null;

  console.log('Found category data:', categoryData);

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Category Not Found: "{category}"
          </h1>
          <p className="text-gray-600 mb-4">
            Available categories: {Object.keys(categories).join(', ')}
          </p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check if category is allowed for user's subscription
  const categoryAllowed = isCategoryAllowed(categoryData.name);
  const canCreateNewQuiz = canCreateQuiz() && categoryAllowed;
  const remainingQuizzes = limits.maxQuizzes === Infinity 
    ? Infinity 
    : Math.max(0, limits.maxQuizzes - (usage?.quizzes_created_total || 0));

  const handleCreateQuiz = async () => {
    if (!categoryAllowed) {
      toast({
        title: "Category Not Available",
        description: `${categoryData.name} is not available in your current plan. Please upgrade to access this category.`,
        variant: "destructive"
      });
      return;
    }

    if (!canCreateQuiz()) {
      toast({
        title: "Quiz Creation Limit Reached",
        description: `You've reached your quiz creation limit of ${limits.maxQuizzes} for ${limits.subscriptionTier} plan. Please upgrade to create more quizzes.`,
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Starting quiz generation for category:', categoryData.name);
      
      const { data, error } = await supabase.functions.invoke('quiz-generate', {
        body: { 
          category: categoryData.name
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      console.log('Quiz generation response:', { data, error });

      if (error) {
        console.error('Quiz generation error:', error);
        throw new Error(error.message || 'Failed to generate quiz');
      }

      if (!data?.success || !data?.quiz) {
        console.error('Quiz generation failed - no quiz returned:', data);
        throw new Error('Quiz generation failed - no quiz returned');
      }

      console.log('Quiz generated successfully:', data.quiz);
      
      // Increment quiz count
      await incrementQuizCount();
      
      toast({
        title: "Quiz Generated!",
        description: "Your quiz has been created successfully.",
      });

      // Navigate to play the quiz
      navigate(`/quiz/play/${data.quiz.id}`);
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Subscription Updated!",
      description: "You can now access more categories and create more quizzes. Page will refresh shortly.",
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="ghost" 
          className="mb-6 text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-8">
            <div className={`inline-block p-4 rounded-full bg-gradient-to-r ${categoryData.color} mb-4`}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryData.name}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{categoryData.description}</p>
          </div>

          {/* Category Access Warning */}
          {!categoryAllowed && (
            <Alert className="mb-8 border-orange-200 bg-orange-50">
              <Crown className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>{categoryData.name}</strong> is not available in your current plan ({limits.subscriptionTier}). 
                Upgrade your subscription to access this category.
              </AlertDescription>
            </Alert>
          )}

          {/* Usage Limits Display */}
          {limits.maxQuizzes !== Infinity && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  Quiz Creation Status - {limits.subscriptionTier}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Quizzes Created: {usage?.quizzes_created_total || 0} / {limits.maxQuizzes}
                    </p>
                    <p className="text-sm text-gray-600">
                      Remaining: {remainingQuizzes === Infinity ? '∞' : remainingQuizzes}
                    </p>
                  </div>
                  {(!canCreateNewQuiz || !categoryAllowed) && (
                    <div className="flex gap-2">
                      <RazorpayPayment 
                        planId="devotee"
                        planName="Devotee Plan"
                        price={499}
                        onPaymentSuccess={handlePaymentSuccess}
                        buttonText="Upgrade to Devotee"
                        className="text-sm px-3 py-1 h-8"
                      />
                      <RazorpayPayment 
                        planId="guru"
                        planName="Guru Plan"
                        price={999}
                        onPaymentSuccess={handlePaymentSuccess}
                        buttonText="Upgrade to Guru"
                        className="text-sm px-3 py-1 h-8"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quota Warning */}
          {!canCreateNewQuiz && categoryAllowed && (
            <Alert className="mb-8 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                You've reached your quiz creation limit of {limits.maxQuizzes} for {limits.subscriptionTier} plan. 
                Upgrade your subscription to create more quizzes and unlock additional features.
              </AlertDescription>
            </Alert>
          )}

          {/* Create New Quiz */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Create New Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-2">Generate a new 10-question quiz on {categoryData.name}</p>
                  <p className="text-sm text-gray-500">Estimated time: 5-10 minutes</p>
                </div>
                <Button 
                  onClick={handleCreateQuiz}
                  disabled={isGenerating || !canCreateNewQuiz}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? 'Generating...' : 'Create Quiz'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Previous Quizzes - Only show if category is allowed */}
          {categoryAllowed && (
            <PreviousQuizzes category={categoryData.name} />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCategory;
