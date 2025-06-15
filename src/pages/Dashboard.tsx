
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScriptureCard from '@/components/ScriptureCard';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <ScriptureCard key={`${category.name}-${index}`} category={category} />
          ))}
        </div>
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
