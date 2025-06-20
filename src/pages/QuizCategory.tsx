
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Sparkles,
  Trophy
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useUserLimits } from '@/hooks/useUserLimits';
import FeedbackButton from '@/components/FeedbackButton';

const QuizCategory = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { isCategoryAllowed } = useUserLimits();

  const decodedCategory = category ? decodeURIComponent(category) : '';
  const isAllowed = isCategoryAllowed(decodedCategory);

  const categoryDescriptions: { [key: string]: string } = {
    'Bhagavad Gita': 'Explore the profound teachings of Lord Krishna to Arjuna on the battlefield of Kurukshetra.',
    'Upanishads': 'Dive deep into the philosophical foundations of Vedantic thought.',
    'Ramayana': 'Journey through the epic tale of Lord Rama, Sita, and Hanuman.',
    'Mahabharata': 'Explore the great epic of the Bharata dynasty.',
    'Puranas': 'Discover the ancient stories of gods, goddesses, and cosmic cycles.',
    'Vedas': 'Challenge yourself with the oldest scriptures of Hinduism.'
  };

  const handleCreateQuiz = () => {
    console.log('Creating quiz for category:', decodedCategory);
    
    // Navigate to quiz play page with the category parameter
    navigate('/quiz/play', { 
      state: { 
        category: decodedCategory,
        mode: 'generate'
      }
    });
  };

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <Card className="text-center p-12 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Premium Access Required
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {decodedCategory} quizzes are available with our premium plans. 
                Upgrade to access all sacred scriptures and unlimited quiz creation.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => navigate('/billing')}
                  className="bg-orange-600 hover:bg-orange-700 px-8 py-3"
                >
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="fixed bottom-6 right-6">
            <FeedbackButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Sacred Scripture
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
              {decodedCategory}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {categoryDescriptions[decodedCategory] || 'Explore this sacred scripture through interactive quizzes designed to deepen your spiritual understanding.'}
            </p>
          </div>
        </div>

        {/* Create Quiz Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-gray-600 mb-8">
              Generate a personalized quiz to explore your understanding of {decodedCategory}
            </p>
            
            <Button
              onClick={handleCreateQuiz}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Create Quiz
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Feedback Button */}
        <div className="fixed bottom-6 right-6">
          <FeedbackButton />
        </div>
      </div>
    </div>
  );
};

export default QuizCategory;
