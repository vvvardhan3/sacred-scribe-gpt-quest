import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lock, Crown } from 'lucide-react';
import { useUserLimits } from '@/hooks/useUserLimits';
import { useToast } from '@/hooks/use-toast';
import RazorpayPayment from '@/components/RazorpayPayment';

const QuizCategory = () => {
  const navigate = useNavigate();
  const { limits, usage, canCreateQuiz, isCategoryAllowed } = useUserLimits();
  const { toast } = useToast();

  // All available categories with descriptions
  const allCategories = [
    {
      name: 'Vedas',
      description: 'Ancient sacred texts - Rigveda, Samaveda, Yajurveda, and Atharvaveda',
      icon: '📜',
      difficulty: 'Intermediate',
      requiredPlan: 'Free Trial'
    },
    {
      name: 'Puranas',
      description: 'Stories and legends of gods, goddesses, and ancient heroes',
      icon: '🏛️',
      difficulty: 'Beginner',
      requiredPlan: 'Free Trial'
    },
    {
      name: 'Upanishads',
      description: 'Philosophical texts exploring the nature of reality and consciousness',
      icon: '🧘',
      difficulty: 'Advanced',
      requiredPlan: 'Free Trial'
    },
    {
      name: 'Mahabharata',
      description: 'Epic tale of the Kurukshetra war and dharmic principles',
      icon: '⚔️',
      difficulty: 'Intermediate',
      requiredPlan: 'Devotee Plan'
    },
    {
      name: 'Bhagavad Gita',
      description: 'Divine discourse between Krishna and Arjuna on dharma and yoga',
      icon: '🕉️',
      difficulty: 'Intermediate',
      requiredPlan: 'Devotee Plan'
    },
    {
      name: 'Ramayana',
      description: 'Epic journey of Rama, Sita, and the triumph of good over evil',
      icon: '🏹',
      difficulty: 'Beginner',
      requiredPlan: 'Devotee Plan'
    }
  ];

  const handleCategorySelect = (categoryName: string) => {
    // Check if user can create quizzes
    if (!canCreateQuiz()) {
      toast({
        title: "Quiz Limit Reached",
        description: `You've reached your quiz creation limit of ${limits.maxQuizzes} for ${limits.subscriptionTier} plan. Upgrade to create more quizzes.`,
        variant: "destructive"
      });
      return;
    }

    // Check if category is allowed for user's subscription
    if (!isCategoryAllowed(categoryName)) {
      toast({
        title: "Upgrade Required",
        description: `${categoryName} is not available for your current plan. Please upgrade to access this category.`,
        variant: "destructive"
      });
      return;
    }

    // Navigate to quiz generation
    navigate('/quiz/play', { 
      state: { 
        category: categoryName,
        mode: 'generate' 
      } 
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free Trial': return 'bg-blue-100 text-blue-800';
      case 'Devotee Plan': return 'bg-orange-100 text-orange-800';
      case 'Guru Plan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Scripture Category
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Test your knowledge of Hindu scriptures and deepen your understanding
          </p>
          
          {/* Usage Information */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">{limits.subscriptionTier} Plan</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>Quizzes: {usage?.quizzes_created_total || 0}/{limits.maxQuizzes === Infinity ? '∞' : limits.maxQuizzes}</div>
              <div>Available Categories: {limits.allowedCategories.length}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((category) => {
            const isAllowed = isCategoryAllowed(category.name);
            const canCreate = canCreateQuiz();
            
            return (
              <Card 
                key={category.name}
                className={`relative transition-all duration-200 ${
                  isAllowed && canCreate 
                    ? 'hover:shadow-lg cursor-pointer border-orange-200' 
                    : 'opacity-60 border-gray-200'
                }`}
                onClick={() => isAllowed && canCreate && handleCategorySelect(category.name)}
              >
                {!isAllowed && (
                  <div className="absolute top-2 right-2 z-10">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-center gap-2">
                    <Badge className={getDifficultyColor(category.difficulty)}>
                      {category.difficulty}
                    </Badge>
                    <Badge className={getPlanColor(category.requiredPlan)}>
                      {category.requiredPlan}+
                    </Badge>
                  </div>

                  {isAllowed && canCreate ? (
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category.name);
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Generate Quiz
                    </Button>
                  ) : !isAllowed ? (
                    <div className="space-y-2">
                      <div className="text-xs text-center text-gray-500">
                        Requires {category.requiredPlan} or higher
                      </div>
                      {limits.subscriptionTier === 'Free Trial' && (
                        <div className="flex gap-1">
                          <RazorpayPayment 
                            planId="devotee"
                            planName="Devotee Plan"
                            price={999}
                            buttonText="Upgrade"
                            className="flex-1 text-xs py-1 h-auto"
                          />
                          <RazorpayPayment 
                            planId="guru"
                            planName="Guru Plan"
                            price={2999}
                            buttonText="Go Pro"
                            className="flex-1 text-xs py-1 h-auto"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-center text-red-500">
                      Quiz creation limit reached
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upgrade Section */}
        {limits.subscriptionTier !== 'Guru Plan' && (
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Unlock All Categories</h3>
                <p className="text-gray-600 mb-4">
                  Upgrade your plan to access all Hindu scripture categories and create unlimited quizzes
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
                  {limits.subscriptionTier === 'Devotee Plan' && (
                    <RazorpayPayment 
                      planId="guru"
                      planName="Guru Plan"
                      price={2999}
                      buttonText="Upgrade to Guru - ₹2999/month"
                      className="px-6 py-2"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCategory;
