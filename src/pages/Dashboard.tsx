
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  ArrowRight,
  Crown,
  Star,
  SquareLibrary,
  Lock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useUserLimits } from '@/hooks/useUserLimits';
import { useSubscription } from '@/hooks/useSubscription';
import RazorpayPayment from '@/components/RazorpayPayment';
import FeedbackButton from '@/components/FeedbackButton';
import Footer from '@/components/Footer';

// Move categories outside component to prevent recreation on every render
const SCRIPTURE_CATEGORIES = [
  { 
    name: 'Bhagavad Gita', 
    description: 'Test your knowledge of Krishna\'s teachings and divine wisdom',
    color: 'from-amber-400 to-orange-500'
  },
  { 
    name: 'Upanishads', 
    description: 'Explore the philosophical foundations of Vedantic thought',
    color: 'from-purple-400 to-violet-500'
  },
  { 
    name: 'Ramayana', 
    description: 'Journey through Rama\'s epic story of dharma and devotion',
    color: 'from-emerald-400 to-teal-500'
  },
  { 
    name: 'Mahabharata', 
    description: 'Dive into the great epic of duty, war, and righteousness',
    color: 'from-red-400 to-pink-500'
  },
  { 
    name: 'Puranas', 
    description: 'Ancient stories of gods, creation, and cosmic cycles',
    color: 'from-yellow-400 to-amber-500'
  },
  { 
    name: 'Vedas', 
    description: 'Sacred hymns, rituals, and the foundation of Hindu knowledge',
    color: 'from-cyan-400 to-blue-500'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { limits, usage, isCategoryAllowed } = useUserLimits();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Wait for subscription to load before showing content
  useEffect(() => {
    if (!subscriptionLoading) {
      // Add a small delay to prevent flickering
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [subscriptionLoading]);

  // Memoize categories with their access status
  const categoriesWithAccess = useMemo(() => {
    if (subscriptionLoading || isInitialLoading) {
      // Return all categories as loading while subscription loads
      return SCRIPTURE_CATEGORIES.map(category => ({
        ...category,
        isAllowed: false,
        isLoading: true
      }));
    }
    
    return SCRIPTURE_CATEGORIES.map(category => ({
      ...category,
      isAllowed: isCategoryAllowed(category.name),
      isLoading: false
    }));
  }, [isCategoryAllowed, subscriptionLoading, isInitialLoading]);

  const hasLockedCategories = categoriesWithAccess.some(cat => !cat.isAllowed && !cat.isLoading);

  const renderScriptureCard = (category: any) => {
    if (category.isLoading) {
      return (
        <Card className="h-full transition-all duration-300 border-0 bg-white overflow-hidden min-h-[200px]">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color} opacity-50`} />
          <div className="p-6 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        </Card>
      );
    }

    if (category.isAllowed) {
      return (
        <Link to={`/quiz/category/${encodeURIComponent(category.name)}`} className="group block">
          <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white overflow-hidden min-h-[200px]">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color}`} />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {category.description}
              </p>
              
              <div className="flex items-center justify-end text-sm">
                <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                  <span>Start Quiz</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
      );
    } else {
      return (
        <Card className="h-full transition-all duration-300 border-0 bg-white/60 opacity-75 relative overflow-hidden cursor-not-allowed min-h-[200px]">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color} opacity-50`} />
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-600">
                {category.name}
              </h3>
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              {category.description}
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Crown className="w-4 h-4 mr-1" />
              <span>Premium Access Required</span>
            </div>
          </div>
        </Card>
      );
    }
  };

  const handleStartConversation = () => {
    navigate('/chat');
  };

  // Show loading state while subscription is loading
  if (subscriptionLoading || isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="text-lg text-gray-600">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <Navigation />

      {/* Scripture Categories Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 text-sm font-medium">
              <SquareLibrary className="w-4 h-4 mr-2" />
              Spiritual Knowledge
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Sacred Scripture Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the timeless wisdom of Hindu scriptures through interactive quizzes and deepen your spiritual understanding
          </p>
        </div>
        
        {/* All Categories in One Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categoriesWithAccess.map((category) => (
            <div key={category.name}>
              {renderScriptureCard(category)}
            </div>
          ))}
        </div>

        {/* Upgrade CTA - Only show if user has locked categories */}
        {hasLockedCategories && (
          <div className="mb-8">
            <Card className="max-w-4xl mx-auto border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-orange-500 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-900">Unlock All Sacred Scriptures</h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg">
                  Get access to all scriptures and create unlimited quizzes with our premium plans
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <RazorpayPayment 
                    planId="devotee"
                    planName="Devotee Plan"
                    price={499}
                    buttonText="Upgrade to Devotee - ₹499/month"
                    className="px-8 py-3 text-lg bg-orange-500 hover:bg-orange-600"
                  />
                  <RazorpayPayment 
                    planId="guru"
                    planName="Guru Plan"
                    price={999}
                    buttonText="Go Pro with Guru - ₹999/month"
                    className="px-8 py-3 text-lg bg-purple-500 hover:bg-purple-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* AI Chat CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-0 text-white overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ask HinduGPT Assistant</h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Get instant answers with proper citations from Hindu scriptures. Start a meaningful conversation about philosophy, spirituality, and ancient wisdom.
            </p>
            <Button 
              onClick={handleStartConversation}
              className="bg-white text-orange-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Conversation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>

       <section>
        <Footer/>
      </section>

      {/* Fixed Feedback Button */}
      <div className="fixed bottom-6 right-6">
        <FeedbackButton />
      </div>
    </div>
  );
};

export default Dashboard;
