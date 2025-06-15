
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  MessageCircle, 
  Settings, 
  LogOut, 
  ArrowRight, 
  Target, 
  Users, 
  TrendingUp,
  Play,
  Sparkles,
  Brain
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const categories = [
    { 
      name: 'Bhagavad Gita', 
      description: 'Test your knowledge of Krishna\'s teachings',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
      color: 'from-amber-400 to-orange-500',
      questions: '150+ Questions',
      difficulty: 'Beginner to Advanced'
    },
    { 
      name: 'Upanishads', 
      description: 'Explore the philosophical foundations',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop&crop=center',
      color: 'from-purple-400 to-violet-500',
      questions: '120+ Questions',
      difficulty: 'Intermediate'
    },
    { 
      name: 'Ramayana', 
      description: 'Journey through Rama\'s epic story',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop&crop=center',
      color: 'from-emerald-400 to-teal-500',
      questions: '200+ Questions',
      difficulty: 'All Levels'
    },
    { 
      name: 'Mahabharata', 
      description: 'Dive into the great epic',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=center',
      color: 'from-red-400 to-pink-500',
      questions: '180+ Questions',
      difficulty: 'Intermediate to Advanced'
    },
    { 
      name: 'Puranas', 
      description: 'Ancient stories and wisdom',
      image: 'https://images.unsplash.com/photo-1604608672516-b9b8f2b4ca5c?w=400&h=300&fit=crop&crop=center',
      color: 'from-yellow-400 to-amber-500',
      questions: '100+ Questions',
      difficulty: 'Beginner'
    },
    { 
      name: 'Vedas', 
      description: 'Sacred hymns and rituals',
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop&crop=center',
      color: 'from-cyan-400 to-blue-500',
      questions: '80+ Questions',
      difficulty: 'Advanced'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                HinduGPT
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-orange-700 hover:text-orange-800 font-medium transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Quizzes</span>
              </Link>
              <Link 
                to="/chat" 
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-700 font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
              
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Discover Ancient
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Wisdom</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore the timeless teachings of Hindu scriptures through interactive quizzes and AI-powered conversations. 
            Deepen your understanding with personalized learning experiences.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-1">1000+</h3>
              <p className="text-sm text-gray-600">Questions Available</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-1">50K+</h3>
              <p className="text-sm text-gray-600">Active Learners</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-1">6</h3>
              <p className="text-sm text-gray-600">Scripture Categories</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-1">98%</h3>
              <p className="text-sm text-gray-600">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Scripture Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Scripture Quizzes</h2>
              <p className="text-gray-600">Choose your path to spiritual knowledge</p>
            </div>
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              View All Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/quiz/category/${encodeURIComponent(category.name)}`}
                className="group block"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  
                  {/* Content with gradient overlay */}
                  <div className="relative z-10 bg-gradient-to-t from-white/95 via-white/90 to-white/95 h-full">
                    <div className="p-6 h-full flex flex-col">
                      <div className="mb-4 flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                            {category.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 leading-relaxed mb-4">
                            {category.description}
                          </CardDescription>
                        </div>
                        <div className="inline-flex items-center px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-orange-100">
                          <span className="text-xs font-medium text-gray-700">{category.difficulty}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">{category.questions}</span>
                        <div className="flex items-center text-orange-600">
                          <Play className="w-4 h-4 mr-1" />
                          <span className="font-medium">Start Quiz</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Chat Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Scripture Assistant</h2>
            <p className="text-gray-600">Get instant answers and deep insights from ancient wisdom</p>
          </div>
          
          <Card className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-0 shadow-2xl max-w-4xl mx-auto overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
            <CardHeader className="text-center pb-6 pt-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Chat with HinduGPT Assistant
              </CardTitle>
              <CardDescription className="text-lg text-gray-700 max-w-2xl mx-auto">
                Ask questions and receive detailed answers with proper citations from Hindu scriptures
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-orange-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 text-orange-600 mr-2" />
                    Key Features
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      Instant scripture citations
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3" />
                      Deep philosophical discussions
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-pink-400 rounded-full mr-3" />
                      Context-aware responses
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-red-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Brain className="w-5 h-5 text-red-600 mr-2" />
                    Smart Capabilities
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                      Multilingual support
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                      Conversation history
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-pink-400 rounded-full mr-3" />
                      Personalized guidance
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <Link to="/chat">
                  <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg rounded-xl">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Start Conversation
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
