
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">HinduGPT</h1>
              <Sparkles className="w-6 h-6 ml-2 text-orange-600" />
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Explore Hindu Scriptures with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover the wisdom of ancient Hindu texts through interactive quizzes and AI-powered conversations. 
            Learn from the Bhagavad Gita, Upanishads, Ramayana, and more with personalized guidance.
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Start Learning Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Learn Through Modern Technology
            </h3>
            <p className="text-lg text-gray-600">
              Combine ancient wisdom with cutting-edge AI for a personalized learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <BookOpen className="w-8 h-8 mr-3 text-orange-600" />
                  Interactive Quizzes
                </CardTitle>
                <CardDescription>
                  Test your knowledge with AI-generated quizzes on Hindu scriptures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personalized difficulty levels</li>
                  <li>• Multiple scripture categories</li>
                  <li>• Detailed explanations for each answer</li>
                  <li>• Track your progress over time</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MessageCircle className="w-8 h-8 mr-3 text-blue-600" />
                  AI Scripture Chat
                </CardTitle>
                <CardDescription>
                  Ask questions and get answers based on authentic Hindu texts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Instant answers with scripture citations</li>
                  <li>• Deep philosophical discussions</li>
                  <li>• Multilingual support</li>
                  <li>• Context-aware responses</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Begin Your Spiritual Journey?
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of learners exploring Hindu wisdom through modern technology
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              Create Your Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <h4 className="text-xl font-bold">HinduGPT</h4>
            <Sparkles className="w-5 h-5 ml-2 text-orange-400" />
          </div>
          <p className="text-gray-400">
            Bridging ancient wisdom with modern AI technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
