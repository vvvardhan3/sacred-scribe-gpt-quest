import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lock, Crown, ArrowLeft, Plus } from 'lucide-react';
import { useUserLimits } from '@/hooks/useUserLimits';
import { useToast } from '@/hooks/use-toast';
import RazorpayPayment from '@/components/RazorpayPayment';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const QuizCategory = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  const { user } = useAuth();
  const { limits, usage, canCreateQuiz, isCategoryAllowed } = useUserLimits();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const decodedCategory = category ? decodeURIComponent(category) : '';

  useEffect(() => {
    fetchQuizzes();
  }, [category, user]);

  const fetchQuizzes = async () => {
    if (!user || !category) return;

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          id,
          title,
          description,
          created_at,
          questions(count)
        `)
        .eq('category', decodedCategory)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    if (!canCreateQuiz()) {
      toast({
        title: "Quiz Limit Reached",
        description: `You've reached your quiz creation limit of ${limits.maxQuizzes} for ${limits.subscriptionTier} plan. Upgrade to create more quizzes.`,
        variant: "destructive"
      });
      return;
    }

    if (!isCategoryAllowed(decodedCategory)) {
      toast({
        title: "Upgrade Required",
        description: `${decodedCategory} is not available for your current plan. Please upgrade to access this category.`,
        variant: "destructive"
      });
      return;
    }

    navigate('/quiz/play', { 
      state: { 
        category: decodedCategory,
        mode: 'generate' 
      } 
    });
  };

  const handleQuizSelect = (quizId: string) => {
    navigate('/quiz/play', { 
      state: { 
        quizId,
        mode: 'play' 
      } 
    });
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const categoryAllowed = isCategoryAllowed(decodedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {decodedCategory} Quizzes
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Test your knowledge and deepen your understanding of {decodedCategory}
          </p>
          
          {/* Usage Information */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">{limits.subscriptionTier} Plan</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>Quizzes: {usage?.quizzes_created_total || 0}/{limits.maxQuizzes === Infinity ? '∞' : limits.maxQuizzes}</div>
            </div>
          </div>
        </div>

        {!categoryAllowed ? (
          <div className="text-center">
            <Card className="max-w-2xl mx-auto border-orange-200">
              <CardContent className="p-8">
                <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Upgrade Required</h3>
                <p className="text-gray-600 mb-6">
                  {decodedCategory} quizzes require a higher subscription plan. Upgrade to unlock this category.
                </p>
                <div className="flex gap-4 justify-center">
                  {limits.subscriptionTier === 'Free Trial' && (
                    <>
                      <RazorpayPayment 
                        planId="devotee"
                        planName="Devotee Plan"
                        price={999}
                        buttonText="Upgrade to Devotee - ₹999/month"
                        className="px-6 py-2"
                      />
                      <RazorpayPayment 
                        planId="guru"
                        planName="Guru Plan"
                        price={2999}
                        buttonText="Go Pro - ₹2999/month"
                        className="px-6 py-2"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            {/* Create New Quiz Button */}
            <div className="mb-8 text-center">
              <Button 
                onClick={handleCreateQuiz}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3"
                disabled={!canCreateQuiz()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Quiz
              </Button>
              {!canCreateQuiz() && (
                <p className="text-sm text-red-500 mt-2">
                  Quiz creation limit reached for your plan
                </p>
              )}
            </div>

            {/* Existing Quizzes */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-10 bg-gray-200 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No quizzes yet</h3>
                <p className="text-gray-500 mb-6">
                  Create your first quiz for {decodedCategory} to get started
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <Card 
                    key={quiz.id}
                    className="transition-all duration-200 hover:shadow-lg cursor-pointer border-orange-200"
                    onClick={() => handleQuizSelect(quiz.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {quiz.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Questions: {quiz.questions?.[0]?.count || 0}</span>
                        <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuizSelect(quiz.id);
                        }}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Take Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCategory;
