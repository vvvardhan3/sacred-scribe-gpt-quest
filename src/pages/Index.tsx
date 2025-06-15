
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageCircle, Sparkles, ArrowRight, Zap } from 'lucide-react';
import PricingSection from '@/components/PricingSection';
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
              <Sparkles className="w-6 h-6 text-orange-600" />
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
              <Sparkles className="w-4 h-4 text-orange-500" />
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
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-6">
              Learn Through Modern Technology
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combine ancient wisdom with cutting-edge AI for a personalized learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:from-slate-700/50 hover:to-slate-800/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/50 group-hover:scale-110 transition-all duration-500">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">Interactive Quizzes</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  Test your knowledge with AI-generated quizzes on Hindu scriptures
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                    <span className="text-gray-300 font-medium">Personalized difficulty levels</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-75">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                    <span className="text-gray-300 font-medium">Multiple scripture categories</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-150">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                    <span className="text-gray-300 font-medium">Detailed explanations</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-225">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                    <span className="text-gray-300 font-medium">Progress tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:from-slate-700/50 hover:to-slate-800/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-500">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">AI Scripture Chat</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  Ask questions and get answers based on authentic Hindu texts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    <span className="text-gray-300 font-medium">Instant answers with citations</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-75">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    <span className="text-gray-300 font-medium">Deep philosophical discussions</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-150">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    <span className="text-gray-300 font-medium">Multilingual support</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-225">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    <span className="text-gray-300 font-medium">Context-aware responses</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:from-slate-700/50 hover:to-slate-800/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-500">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">Personalized Learning</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  Adaptive learning paths tailored to your spiritual journey
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-gray-300 font-medium">Custom study plans</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-75">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-gray-300 font-medium">Performance analytics</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-150">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-gray-300 font-medium">Spiritual milestones</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30 backdrop-blur-sm group-hover:bg-slate-700/30 transition-all duration-300 delay-225">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-gray-300 font-medium">Community support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 relative overflow-hidden">
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
