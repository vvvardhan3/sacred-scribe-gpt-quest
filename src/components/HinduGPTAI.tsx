
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, BookOpen, Star, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HinduGPTAI = () => {
  const capabilities = [
    {
      icon: Brain,
      title: "Advanced Scripture Understanding",
      description: "Deep comprehension of Sanskrit texts, philosophical concepts, and spiritual teachings.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: MessageCircle,
      title: "Contextual Conversations",
      description: "Engaging dialogues with personalized guidance based on ancient wisdom.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Multi-Scripture Knowledge",
      description: "Comprehensive knowledge spanning Vedas, Upanishads, Puranas, and Epics.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      title: "Authentic Citations",
      description: "Every answer comes with proper references to original texts.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 rounded-full border border-orange-200 mb-6">
            <Sparkles className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-orange-700">Powered by Advanced AI Technology</span>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            Meet HinduGPT AI
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Experience the future of spiritual learning with our AI trained specifically on Hindu philosophy and scriptures. 
            Get accurate, respectful, and enlightening responses tailored to your understanding level.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Features */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">What Makes HinduGPT Special?</h3>
            
            {capabilities.map((capability, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
                <div className={`w-12 h-12 bg-gradient-to-r ${capability.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <capability.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{capability.title}</h4>
                  <p className="text-gray-600">{capability.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - CTA Card */}
          <div className="lg:pl-8">
            <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 border-0 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-center">Start Your Spiritual Journey</h3>
                <p className="text-lg text-white/90 mb-6 text-center">
                  Experience AI-powered conversations about Hindu philosophy, get instant answers with proper citations, and deepen your spiritual understanding.
                </p>
                
                <div className="space-y-4">
                  <Link to="/chat" className="block">
                    <Button 
                      className="w-full bg-white text-orange-600 hover:bg-white/90 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      Ask HinduGPT Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80 pt-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span>Available 24/7</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span>Scholarly Accurate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span>Culturally Respectful</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Instant Responses</h4>
            <p className="text-sm text-gray-600">Get immediate answers to complex philosophical questions</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Cultural Context</h4>
            <p className="text-sm text-gray-600">Understanding of traditions and regional variations</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Sanskrit Support</h4>
            <p className="text-sm text-gray-600">Comprehensive understanding of Sanskrit concepts</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Personalized</h4>
            <p className="text-sm text-gray-600">Adapts explanations to your understanding level</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HinduGPT;
