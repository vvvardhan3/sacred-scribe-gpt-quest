
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserLimits } from '@/hooks/useUserLimits';
import { QuizCategoryContent } from '@/components/quiz/QuizCategoryContent';
import LoadingSkeleton from '@/components/LoadingSkeleton';

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
  console.log('Finding category for param:', param);
  
  // Decode the URL parameter to handle spaces and special characters
  const decodedParam = decodeURIComponent(param).toLowerCase();
  console.log('Decoded param:', decodedParam);
  
  // Try direct match first
  if (categories[param as keyof typeof categories]) {
    console.log('Found direct match:', param);
    return categories[param as keyof typeof categories];
  }
  
  // Try normalized match (spaces to hyphens)
  const normalizedParam = normalizeCategoryName(decodedParam);
  console.log('Normalized param:', normalizedParam);
  
  if (categories[normalizedParam as keyof typeof categories]) {
    console.log('Found normalized match:', normalizedParam);
    return categories[normalizedParam as keyof typeof categories];
  }
  
  // Try to match by category name
  for (const [key, category] of Object.entries(categories)) {
    const normalizedCategoryName = normalizeCategoryName(category.name);
    console.log('Checking category:', category.name, 'normalized:', normalizedCategoryName);
    
    if (normalizedCategoryName === normalizedParam || 
        category.name.toLowerCase() === decodedParam) {
      console.log('Found category by name match:', key);
      return category;
    }
  }
  
  console.log('No category found for param:', param);
  return null;
};

const QuizCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const { canCreateQuiz, usage, limits, incrementQuizCount, isCategoryAllowed, loading } = useUserLimits();

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
          {/* Loading State */}
          {loading ? (
            <div className="space-y-6">
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </div>
          ) : (
            <QuizCategoryContent
              categoryData={categoryData}
              usage={usage}
              limits={limits}
              categoryAllowed={categoryAllowed}
              canCreateNewQuiz={canCreateNewQuiz}
              remainingQuizzes={remainingQuizzes}
              isGenerating={isGenerating}
              onCreateQuiz={handleCreateQuiz}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCategory;
