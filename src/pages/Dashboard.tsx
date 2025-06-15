
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
import { BookOpen, MessageCircle, Settings, LogOut, Sparkles, Trophy, Brain, Quote, Star } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const categories = [
    { 
      name: 'Bhagavad Gita', 
      description: 'Test your knowledge of Krishna\'s teachings',
      icon: Quote,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      name: 'Upanishads', 
      description: 'Explore the philosophical foundations',
      icon: Brain,
      color: 'from-purple-500 to-pink-600'
    },
    { 
      name: 'Ramayana', 
      description: 'Journey through Rama\'s epic story',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      name: 'Mahabharata', 
      description: 'Dive into the great epic',
      icon: Trophy,
      color: 'from-red-500 to-orange-600'
    },
    { 
      name: 'Puranas', 
      description: 'Ancient stories and wisdom',
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      name: 'Vedas', 
      description: 'Sacred hymns and rituals',
      icon: Sparkles,
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  const AppSidebar = () => {
    return (
      <Sidebar className="border-r border-border">
        <SidebarHeader className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                HinduGPT
              </h1>
              <p className="text-xs text-muted-foreground">Spiritual Learning</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 p-4">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-12 justify-start">
                    <Link to="/dashboard" className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-medium">Quizzes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-12 justify-start">
                    <Link to="/chat" className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">Chat</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border">
          <SidebarMenu className="space-y-2">
            <SidebarMenuItem>
              <SidebarMenuButton className="h-12 justify-start">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} className="h-12 justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="p-8">
            {/* Welcome Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your Spiritual Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Explore the timeless wisdom of Hindu scriptures through interactive quizzes and AI-powered conversations
              </p>
            </div>

            {/* Scripture Categories Grid */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Scripture Quizzes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={category.name}
                      to={`/quiz/category/${encodeURIComponent(category.name)}`}
                      className="group block"
                    >
                      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm">
                        <CardHeader className="text-center pb-2">
                          <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {category.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm text-gray-600 text-center">
                            {category.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* AI Chat Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Scripture Chat</h3>
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl max-w-2xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    Chat with HinduGPT Assistant
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    Ask questions and receive detailed answers with proper citations from Hindu scriptures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-gray-900 mb-2">✨ Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Instant answers with scripture citations</li>
                      <li>• Deep philosophical discussions</li>
                      <li>• Context-aware responses</li>
                      <li>• Conversation history</li>
                    </ul>
                  </div>
                  
                  <Link to="/chat" className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Conversation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="pt-6">
                  <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-900">Interactive Learning</h4>
                  <p className="text-sm text-green-700">Engage with ancient wisdom through modern technology</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-6">
                  <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-900">AI-Powered Insights</h4>
                  <p className="text-sm text-purple-700">Get personalized explanations and guidance</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="pt-6">
                  <Sparkles className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-orange-900">Spiritual Growth</h4>
                  <p className="text-sm text-orange-700">Track your progress and deepen your understanding</p>
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
