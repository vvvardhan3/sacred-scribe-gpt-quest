
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  MessageCircle, 
  LogOut, 
  ArrowRight
} from 'lucide-react';
import { useLazyLoading } from '@/hooks/useLazyLoading';
import { useScrollObserver } from '@/hooks/useScrollObserver';
import ScriptureCard from '@/components/ScriptureCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const { user, signOut } = useAuth();

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

  const { displayedItems, hasMore, isLoading, loadMore } = useLazyLoading({
    items: categories,
    itemsPerLoad: 2,
    initialLoad: 4
  });

  const observerRef = useScrollObserver({
    onIntersect: loadMore,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Header */}
      <Navigation />

      {/* User Actions */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-end items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-2 text-orange-600 font-medium">
              <BookOpen className="w-5 h-5" />
              <span>Quizzes</span>
            </Link>
            <Link to="/chat" className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 font-medium transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-600 hover:text-red-600">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Master Ancient 
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Wisdom</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Interactive quizzes and AI conversations to deepen your understanding of Hindu scriptures
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">1000+</div>
            <div className="text-sm text-gray-600">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">6</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">50K+</div>
            <div className="text-sm text-gray-600">Learners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">98%</div>
            <div className="text-sm text-gray-600">Success</div>
          </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((category, index) => (
            <ScriptureCard key={`${category.name}-${index}`} category={category} />
          ))}
          
          {isLoading && (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          )}
        </div>
        
        {hasMore && (
          <div ref={observerRef} className="h-10 flex items-center justify-center mt-8">
            {isLoading && (
              <div className="text-gray-500 text-sm flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading more categories...</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* AI Chat CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-0 text-white overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ask HinduGPT Assistant</h3>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Get instant answers with proper citations from Hindu scriptures
            </p>
            <Link to="/chat">
              <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-xl">
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
