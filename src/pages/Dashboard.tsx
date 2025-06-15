
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  ArrowRight,
  Crown,
  Star,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScriptureCard from '@/components/ScriptureCard';
import Navigation from '@/components/Navigation';
import { useUserLimits } from '@/hooks/useUserLimits';
import RazorpayPayment from '@/components/RazorpayPayment';

// Move categories outside component to prevent re-creation on every render
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
  const { limits, usage, isCategoryAllowed } = useUserLimits();

  // Memoize filtered categories to prevent unnecessary re-renders
  const { allowedCategories, lockedCategories } = useMemo(() => {
    const allowed = SCRIPTURE_CATEGORIES.filter(category => isCategoryAllowed(category.name));
    const locked = SCRIPTURE_CATEGORIES.filter(category => !isCategoryAllowed(category.name));
    return { allowedCategories: allowed, lockedCategories: locked };
  }, [isCategoryAllowed]);

  const handleStartConversation = () => {
    // Open chat in a new window
    window.open('/chat', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <Navigation />

      {/* Hero Section for Scripture Library */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl mr-4">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 bg-clip-text text-transparent">
              Sacred Scripture Library
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the timeless wisdom of Hindu scriptures through interactive quizzes and deepen your spiritual understanding
          </p>
          <div className="flex items-center justify-center mt-6">
            <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-orange-600 font-medium">Interactive Learning • Ancient Wisdom • Modern Experience</span>
            <Sparkles className="w-5 h-5 text-orange-500 ml-2" />
          </div>
        </div>
        
        {/* Available Categories */}
        {allowedCategories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
              <h2 className="px-6 text-2xl font-semibold text-gray-800">Available Scriptures</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allowedCategories.map((category) => (
                <div key={category.name} className="transform hover:scale-[1.02] transition-all duration-300">
                  <ScriptureCard category={category} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Categories */}
        {lockedCategories.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              <div className="flex items-center px-6">
                <Crown className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800">Premium Scriptures</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {lockedCategories.map((category) => (
                <Card key={category.name} className="h-full transition-all duration-300 border-0 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/40 backdrop-blur-sm relative overflow-hidden group hover:shadow-xl">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color} opacity-60`} />
                  
                  {/* Premium overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 group-hover:from-purple-500/20 group-hover:to-indigo-500/20 transition-all duration-500"></div>
                  
                  <div className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-700 group-hover:text-gray-800 transition-colors">
                        {category.name}
                      </h3>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Crown className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-center text-sm text-purple-600 font-medium bg-purple-50 rounded-lg py-3 px-4">
                      <Crown className="w-4 h-4 mr-2" />
                      <span>Premium Access Required</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Enhanced Unlock All Sacred Scriptures CTA */}
            <div className="relative">
              <Card className="max-w-5xl mx-auto border-0 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 p-1 rounded-2xl shadow-2xl">
                <div className="bg-white rounded-2xl p-10">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-orange-100 to-purple-100 rounded-2xl mr-4">
                        <Star className="w-10 h-10 text-orange-600" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                        Unlock All Sacred Scriptures
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-8 text-lg max-w-3xl mx-auto leading-relaxed">
                      Embark on a complete spiritual journey with access to Bhagavad Gita, Mahabharata, Ramayana, and unlimited quiz creation with our premium plans
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <RazorpayPayment 
                        planId="devotee"
                        planName="Devotee Plan"
                        price={999}
                        buttonText="Start Your Journey - ₹999/month"
                        className="px-10 py-4 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                      />
                      <RazorpayPayment 
                        planId="guru"
                        planName="Guru Plan"
                        price={2999}
                        buttonText="Become a Guru - ₹2999/month"
                        className="px-10 py-4 text-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* Enhanced AI Chat CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <Card className="border-0 bg-gradient-to-r from-gray-900 via-orange-900 to-red-900 text-white overflow-hidden relative shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-orange-300 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-red-300 rounded-full animate-ping"></div>
          </div>
          
          <CardContent className="p-12 text-center relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-6">Ask HinduGPT Assistant</h3>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant answers with proper citations from Hindu scriptures. Start a meaningful conversation about philosophy, spirituality, and ancient wisdom with our AI assistant.
            </p>
            <Button 
              onClick={handleStartConversation}
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-lg"
            >
              Start Sacred Conversation
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
