
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, BookOpen, Star, Zap, Globe, ArrowRight, Sparkles, Users, Shield, Clock, Target, Lightbulb, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const HinduGPTAI = () => {
  const capabilities = [
    {
      icon: Brain,
      title: "Advanced Scripture Understanding",
      description: "Deep comprehension of Sanskrit texts, philosophical concepts, and spiritual teachings with contextual accuracy.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: MessageCircle,
      title: "Contextual Conversations",
      description: "Engaging dialogues with personalized guidance based on ancient wisdom and your spiritual journey.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Multi-Scripture Knowledge",
      description: "Comprehensive knowledge spanning Vedas, Upanishads, Puranas, Epics, and contemporary interpretations.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      title: "Authentic Citations",
      description: "Every answer comes with proper references to original texts, ensuring authenticity and scholarly accuracy.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get spiritual guidance anytime, anywhere",
      accent: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Culturally Respectful",
      description: "Maintains traditional values and context",
      accent: "text-green-600"
    },
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adapts to your understanding level",
      accent: "text-purple-600"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Sanskrit, Hindi, and English explanations",
      accent: "text-orange-600"
    }
  ];

  const highlights = [
    {
      icon: Zap,
      title: "Instant Responses",
      description: "Get immediate answers to complex philosophical questions with detailed explanations"
    },
    {
      icon: Target,
      title: "Precise Context",
      description: "Understanding of traditions, regional variations, and historical significance"
    },
    {
      icon: Lightbulb,
      title: "Sanskrit Mastery",
      description: "Comprehensive understanding of Sanskrit concepts, etymology, and meanings"
    },
    {
      icon: Heart,
      title: "Spiritual Guidance",
      description: "Personalized advice adapting explanations to your spiritual understanding level"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Enhanced Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-100 to-red-100 rounded-full opacity-20 -translate-x-48 -translate-y-48 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-red-100 to-orange-100 rounded-full opacity-20 translate-x-40 translate-y-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full opacity-10 -translate-x-32 -translate-y-32"></div>
        
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-red-100 px-8 py-4 rounded-full border border-orange-200 mb-8 shadow-lg">
            <Sparkles className="w-6 h-6 text-orange-600 mr-3 animate-pulse" />
            <span className="text-lg font-semibold text-orange-700">Powered by Advanced AI Technology</span>
          </div>
          
          <h2 className="text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent mb-8 leading-tight">
            Meet HinduGPT AI
          </h2>
          
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Experience the future of spiritual learning with our AI trained specifically on Hindu philosophy and scriptures. 
            Get accurate, respectful, and enlightening responses tailored to your spiritual journey.
          </p>
        </div>

        {/* Enhanced Main Features Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Capabilities */}
          <div className="space-y-8">
            <h3 className="text-4xl font-bold text-gray-900 mb-12 text-center lg:text-left">
              What Makes Our AI Special?
            </h3>
            
            {capabilities.map((capability, index) => (
              <div key={index} className="group flex items-start space-x-6 p-8 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-orange-100 transform hover:-translate-y-1">
                <div className={`w-16 h-16 bg-gradient-to-r ${capability.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors">{capability.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-lg">{capability.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Enhanced Interactive Demo Card */}
          <div className="lg:pl-8">
            <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 border-0 text-white overflow-hidden relative shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12"></div>
              
              <CardContent className="p-10 relative z-10">
                <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold mb-6 text-center">Start Your Spiritual Journey</h3>
                <p className="text-xl text-white/90 mb-10 text-center leading-relaxed">
                  Experience AI-powered conversations about Hindu philosophy, get instant answers with proper citations, and deepen your spiritual understanding through personalized guidance.
                </p>
                
                <div className="space-y-6">
                  <Link to="/chat" className="block">
                    <Button 
                      className="w-full bg-white text-orange-600 hover:bg-white/90 font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-xl"
                    >
                      Ask HinduGPT Now
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors">
                        <feature.icon className="w-5 h-5 text-white/70" />
                        <span className="text-sm font-medium">{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Bottom Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="group text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                <highlight.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg group-hover:text-orange-700 transition-colors">{highlight.title}</h4>
              <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HinduGPTAI;
