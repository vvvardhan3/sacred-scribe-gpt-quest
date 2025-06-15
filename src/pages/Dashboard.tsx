
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter
} from '@/components/ui/sidebar';
import { BookOpen, MessageCircle, Settings, LogOut, Sparkles, Trophy, Brain, Quote, Star, ArrowRight, Zap, Target, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const categories = [
    { 
      name: 'Bhagavad Gita', 
      description: 'Test your knowledge of Krishna\'s teachings',
      icon: Quote,
      color: 'from-amber-400 to-orange-500',
      questions: '150+ Questions',
      difficulty: 'Beginner to Advanced'
    },
    { 
      name: 'Upanishads', 
      description: 'Explore the philosophical foundations',
      icon: Brain,
      color: 'from-purple-400 to-violet-500',
      questions: '120+ Questions',
      difficulty: 'Intermediate'
    },
    { 
      name: 'Ramayana', 
      description: 'Journey through Rama\'s epic story',
      icon: BookOpen,
      color: 'from-emerald-400 to-teal-500',
      questions: '200+ Questions',
      difficulty: 'All Levels'
    },
    { 
      name: 'Mahabharata', 
      description: 'Dive into the great epic',
      icon: Trophy,
      color: 'from-red-400 to-pink-500',
      questions: '180+ Questions',
      difficulty: 'Intermediate to Advanced'
    },
    { 
      name: 'Puranas', 
      description: 'Ancient stories and wisdom',
      icon: Star,
      color: 'from-yellow-400 to-amber-500',
      questions: '100+ Questions',
      difficulty: 'Beginner'
    },
    { 
      name: 'Vedas', 
      description: 'Sacred hymns and rituals',
      icon: Sparkles,
      color: 'from-cyan-400 to-blue-500',
      questions: '80+ Questions',
      difficulty: 'Advanced'
    }
  ];

  const AppSidebar = () => {
    return (
      <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <SidebarHeader className="p-6 border-b border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                HinduGPT
              </h1>
              <p className="text-xs text-slate-500 font-medium">Spiritual Learning Platform</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="px-4 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-12 justify-start hover:bg-orange-50 hover:text-orange-700 rounded-xl transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="font-semibold">Quizzes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-12 justify-start hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200">
                    <Link to="/chat" className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold">Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-slate-200/60">
          <SidebarMenu className="space-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-12 justify-start hover:bg-slate-50 rounded-xl transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-slate-600" />
                </div>
                <span className="font-semibold text-slate-700">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} className="h-12 justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-semibold">Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-6 pt-4 border-t border-slate-200/60">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{user?.email}</p>
                <p className="text-xs text-slate-500">Active Member</p>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="p-8 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-6">
                <Zap className="w-4 h-4 text-orange-600 mr-2" />
                <span className="text-sm font-semibold text-orange-800">Welcome to Your Spiritual Journey</span>
              </div>
              <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Discover Ancient
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent"> Wisdom</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Explore the timeless teachings of Hindu scriptures through interactive quizzes and AI-powered conversations. 
                Deepen your understanding with personalized learning experiences.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">1000+</h3>
                  <p className="text-sm text-slate-600">Questions Available</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">50K+</h3>
                  <p className="text-sm text-slate-600">Active Learners</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">6</h3>
                  <p className="text-sm text-slate-600">Scripture Categories</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">98%</h3>
                  <p className="text-sm text-slate-600">Success Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Scripture Categories */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Scripture Quizzes</h2>
                  <p className="text-slate-600">Choose your path to spiritual knowledge</p>
                </div>
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  View All Categories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={category.name}
                      to={`/quiz/category/${encodeURIComponent(category.name)}`}
                      className="group block"
                    >
                      <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <IconComponent className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="inline-flex items-center px-2 py-1 bg-slate-100 rounded-full">
                                <span className="text-xs font-medium text-slate-700">{category.difficulty}</span>
                              </div>
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                            {category.name}
                          </CardTitle>
                          <CardDescription className="text-slate-600 leading-relaxed">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 font-medium">{category.questions}</span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* AI Chat Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Scripture Assistant</h2>
                <p className="text-slate-600">Get instant answers and deep insights from ancient wisdom</p>
              </div>
              
              <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-2xl max-w-4xl mx-auto overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    Chat with HinduGPT Assistant
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-700 max-w-2xl mx-auto">
                    Ask questions and receive detailed answers with proper citations from Hindu scriptures
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-blue-100">
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                        <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                        Key Features
                      </h4>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                          Instant scripture citations
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                          Deep philosophical discussions
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                          Context-aware responses
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100">
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                        <Brain className="w-5 h-5 text-indigo-600 mr-2" />
                        Smart Capabilities
                      </h4>
                      <ul className="space-y-2 text-slate-600">
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
                      <Button className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg rounded-xl">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
