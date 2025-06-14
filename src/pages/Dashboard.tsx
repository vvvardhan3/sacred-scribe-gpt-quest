
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageCircle, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const categories = [
    { name: 'Bhagavad Gita', description: 'Test your knowledge of Krishna\'s teachings' },
    { name: 'Upanishads', description: 'Explore the philosophical foundations' },
    { name: 'Ramayana', description: 'Journey through Rama\'s epic story' },
    { name: 'Mahabharata', description: 'Dive into the great epic' },
    { name: 'Puranas', description: 'Ancient stories and wisdom' },
    { name: 'Vedas', description: 'Sacred hymns and rituals' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">HinduGPT</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HinduGPT</h2>
          <p className="text-lg text-gray-600">Explore Hindu scriptures through interactive quizzes and AI-powered conversations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quiz Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-orange-600" />
                Scripture Quizzes
              </CardTitle>
              <CardDescription>
                Test your knowledge with AI-generated quizzes on Hindu scriptures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/quiz/category/${encodeURIComponent(category.name)}`}
                    className="block"
                  >
                    <div className="p-4 border rounded-lg hover:bg-orange-50 transition-colors">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chatbot Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                AI Scripture Chat
              </CardTitle>
              <CardDescription>
                Ask questions and get answers based on Hindu scriptures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Chat with our AI assistant trained on Hindu scriptures. Get detailed answers 
                with proper citations and references.
              </p>
              <Link to="/chat">
                <Button className="w-full">
                  Start Conversation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
