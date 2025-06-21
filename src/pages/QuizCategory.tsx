
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowLeft, Sparkles, Clock, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserLimits } from '@/hooks/useUserLimits';
import Navigation from '@/components/Navigation';

// Normalize category names for comparison
const normalizeCategory = (category: string): string => {
  return category.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const CATEGORIES = {
  'bhagavadgita': {
    name: 'Bhagavad Gita',
    description: 'Test your knowledge of Krishna\'s teachings and divine wisdom',
    color: 'from-amber-400 to-orange-500',
    icon: '🕉️',
    topics: ['Dharma', 'Karma Yoga', 'Bhakti Yoga', 'Jnana Yoga', 'Divine Teachings']
  },
  'upanishads': {
    name: 'Upanishads',
    description: 'Explore the philosophical foundations of Vedantic thought',
    color: 'from-purple-400 to-violet-500',
    icon: '📿',
    topics: ['Brahman', 'Atman', 'Moksha', 'Vedantic Philosophy', 'Spiritual Wisdom']
  },
  'ramayana': {
    name: 'Ramayana',
    description: 'Journey through Rama\'s epic story of dharma and devotion',
    color: 'from-emerald-400 to-teal-500',
    icon: '🏹',
    topics: ['Rama\'s Journey', 'Dharma', 'Devotion', 'Epic Characters', 'Moral Lessons']
  },
  'mahabharata': {
    name: 'Mahabharata',
    description: 'Dive into the great epic of duty, war, and righteousness',
    color: 'from-red-400 to-pink-500',
    icon: '⚔️',
    topics: ['Kurukshetra War', 'Pandavas', 'Krishna', 'Dharma', 'Epic Tales']
  },
  'puranas': {
    name: 'Puranas',
    description: 'Ancient stories of gods, creation, and cosmic cycles',
    color: 'from-yellow-400 to-amber-500',
    icon: '🌟',
    topics: ['Creation Stories', 'Divine Tales', 'Cosmic Cycles', 'Mythology', 'Ancient Wisdom']
  },
  'vedas': {
    name: 'Vedas',
    description: 'Test your knowledge of the four Vedas - the foundation of Hindu knowledge',
    color: 'from-cyan-400 to-blue-500',
    icon: '📚',
    topics: ['Rig Veda', 'Sama Veda', 'Yajur Veda', 'Atharva Veda', 'Sacred Hymns']
  }
};

const QuizCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canCreateQuiz, incrementQuizCount, isCategoryAllowed } = useUserLimits();
  const [isCreating, setIsCreating] = useState(false);

  // Normalize the category parameter for lookup
  const normalizedCategory = category ? normalizeCategory(decodeURIComponent(category)) : '';
  const categoryData = CATEGORIES[normalizedCategory as keyof typeof CATEGORIES];

  useEffect(() => {
    if (category && !categoryData) {
      console.error('Category not found:', { 
        original: category, 
        decoded: decodeURIComponent(category),
        normalized: normalizedCategory,
        available: Object.keys(CATEGORIES)
      });
    }
  }, [category, categoryData, normalizedCategory]);

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">Category Not Found</CardTitle>
              <CardDescription>
                The category "{decodeURIComponent(category || '')}" doesn't exist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard')} className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="mt-6 text-sm text-gray-500">
                <p>Available categories:</p>
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {Object.values(CATEGORIES).map((cat) => (
                    <Badge key={cat.name} variant="outline">{cat.name}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAllowed = isCategoryAllowed(categoryData.name);

  const handleCreateQuiz = async () => {
    if (!canCreateQuiz()) {
      toast({
        title: "Quiz Limit Reached",
        description: "You've reached your quiz limit. Please upgrade your plan to create more quizzes.",
        variant: "destructive",
      });
      return;
    }

    if (!isAllowed) {
      toast({
        title: "Premium Feature",
        description: "This category requires a premium subscription. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a quiz.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('quiz-generate', {
        body: { 
          category: categoryData.name,
          difficulty: 'medium',
          questionCount: 10
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success && data?.quiz?.id) {
        await incrementQuizCount();
        navigate(`/quiz/play/${data.quiz.id}`);
      } else {
        throw new Error('Failed to create quiz');
      }
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error Creating Quiz",
        description: error.message || "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${categoryData.color} rounded-full flex items-center justify-center text-3xl`}>
            {categoryData.icon}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryData.name}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{categoryData.description}</p>
        </div>

        {/* Topics Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Topics Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoryData.topics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Creation Card */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-orange-500" />
              Create Your Quiz
            </CardTitle>
            <CardDescription>
              Generate a personalized quiz on {categoryData.name} with 10 thoughtful questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>10-15 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>10 Questions</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span>Medium Difficulty</span>
              </div>
            </div>

            {!isAllowed ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">Premium Category</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Upgrade to Devotee or Guru plan to access this category
                </p>
              </div>
            ) : null}

            <Button
              onClick={handleCreateQuiz}
              disabled={isCreating || !isAllowed}
              className={`w-full py-6 text-lg font-semibold ${
                isAllowed 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Quiz...
                </>
              ) : (
                'Create Quiz'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCategory;
