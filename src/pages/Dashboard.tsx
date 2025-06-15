
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  ArrowRight,
  Lock,
  Crown,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScriptureCard from '@/components/ScriptureCard';
import Navigation from '@/components/Navigation';
import { useUserLimits } from '@/hooks/useUserLimits';
import RazorpayPayment from '@/components/RazorpayPayment';

const Dashboard = () => {
  const { limits, usage, isCategoryAllowed } = useUserLimits();

  const categories = [
    { 
      name: 'Bhagavad Gita', 
      description: 'Test your knowledge of Krishna\'s teachings and divine wisdom',
      color: 'from-amber-400 to-orange-500',
      questions: '150+ Questions',
      difficulty: 'Beginner'
    },
    { 
      name: 'Upanishads', 
      description: 'Explore the philosophical foundations of Vedantic thought',
      color: 'from-purple-400 to-violet-500',
      questions: '120+ Questions',
      difficulty: 'Advanced'
    },
    { 
      name: 'Ramayana', 
      description: 'Journey through Rama\'s epic story of dharma and devotion',
      color: 'from-emerald-400 to-teal-500',
      questions: '200+ Questions',
      difficulty: 'Intermediate'
    },
    { 
      name: 'Mahabharata', 
      description: 'Dive into the great epic of duty, war, and righteousness',
      color: 'from-red-400 to-pink-500',
      questions: '180+ Questions',
      difficulty: 'Advanced'
    },
    { 
      name: 'Puranas', 
      description: 'Ancient stories of gods, creation, and cosmic cycles',
      color: 'from-yellow-400 to-amber-500',
      questions: '100+ Questions',
      difficulty: 'Beginner'
    },
    { 
      name: 'Vedas', 
      description: 'Sacred hymns, rituals, and the foundation of Hindu knowledge',
      color: 'from-cyan-400 to-blue-500',
      questions: '80+ Questions',
      difficulty: 'Advanced'
    }
  ];

  // Separate categories into allowed and locked
  const allowedCategories = categories.filter(category => isCategoryAllowed(category.name));
  const lockedCategories = categories.filter(category => !isCategoryAllowed(category.name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <Navigation />

      {/* Welcome Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Spiritual Learning Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Continue your journey through Hindu scriptures. Choose a category below to start learning or chat with our AI assistant.
          </p>
        </div>
      </section>

      {/* Scripture Categories Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Path</h2>
            <p className="text-gray-600">Select a scripture category to begin your journey</p>
          </div>
        </div>
        
        {/* Available Categories */}
        {allowedCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {allowedCategories.map((category, index) => (
              <ScriptureCard key={`${category.name}-${index}`} category={category} />
            ))}
          </div>
        )}

        {/* Locked Categories */}
        {lockedCategories.length > 0 && (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-500" />
                Premium Scriptures
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {lockedCategories.map((category, index) => (
                <Card key={`${category.name}-${index}`} className="h-full transition-all duration-300 border-0 bg-white/60 opacity-75 relative overflow-hidden cursor-not-allowed">
                  <div className="absolute top-4 right-4 z-10">
                    <Lock className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.color} opacity-50`} />
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-600">
                        {category.name}
                      </h3>
                      <div className="px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
                        {category.difficulty}
                      </div>
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
              ))}
            </div>

            {/* Unlock All Sacred Scriptures CTA */}
            <div className="mb-8">
              <Card className="max-w-4xl mx-auto border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-orange-500 mr-2" />
                    <h3 className="text-2xl font-bold text-gray-900">Unlock All Sacred Scriptures</h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">
                    Get access to Bhagavad Gita, Mahabharata, Ramayana and create unlimited quizzes with our premium plans
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <RazorpayPayment 
                      planId="devotee"
                      planName="Devotee Plan"
                      price={999}
                      buttonText="Upgrade to Devotee - ₹999/month"
                      className="px-8 py-3 text-lg bg-orange-500 hover:bg-orange-600"
                    />
                    <RazorpayPayment 
                      planId="guru"
                      planName="Guru Plan"
                      price={2999}
                      buttonText="Go Pro with Guru - ₹2999/month"
                      className="px-8 py-3 text-lg bg-purple-500 hover:bg-purple-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
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
            <Link to="/chat">
              <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Start Conversation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
