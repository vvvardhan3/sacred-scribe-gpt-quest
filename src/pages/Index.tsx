import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageCircle, ArrowRight, Zap } from 'lucide-react';
import { PricingSection } from '@/components/PricingSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">हिं</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">HinduGPT</h1>
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-orange-50">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-red-100/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 mb-6">
              <span className="text-sm font-medium text-orange-700">AI-Powered Hindu Scripture Learning</span>
            </div>
          </div>
          
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Explore Hindu Scriptures 
            <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              with AI Guidance
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover the profound wisdom of ancient Hindu texts through interactive quizzes and AI-powered conversations. 
            Learn from the Bhagavad Gita, Upanishads, Ramayana, and more with personalized spiritual guidance.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-purple-100/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Learn Through Modern Technology
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combine ancient wisdom with cutting-edge AI for a personalized learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-orange-600 transition-colors duration-300">Interactive Quizzes</CardTitle>
                <CardDescription className="text-gray-600">
                  Test your knowledge with AI-generated quizzes on Hindu scriptures
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Personalized difficulty levels</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Multiple scripture categories</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Detailed explanations</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-225">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Progress tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors duration-300">AI Scripture Chat</CardTitle>
                <CardDescription className="text-gray-600">
                  Ask questions and get answers based on authentic Hindu texts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Instant answers with citations</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Deep philosophical discussions</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Multilingual support</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-225">
                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Context-aware responses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transform hover:scale-105 md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 group-hover:scale-110">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors duration-300">Personalized Learning</CardTitle>
                <CardDescription className="text-gray-600">
                  Adaptive learning paths tailored to your spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Custom study plans</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Performance analytics</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-150">
                    <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Spiritual milestones</span>
                  </li>
                  <li className="flex items-center space-x-2 group-hover:translate-x-2 transition-transform duration-300 delay-225">
                    <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span>Community support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Begin Your Spiritual Journey?
          </h3>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners exploring Hindu wisdom through modern AI technology. 
            Start your personalized learning experience today.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              Create Your Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
