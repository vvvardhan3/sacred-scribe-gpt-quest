
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, BookOpen, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HinduGPTAI = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get instant answers about Hindu philosophy and scriptures"
    },
    {
      icon: BookOpen,
      title: "Sacred Texts Knowledge",
      description: "Access wisdom from Vedas, Upanishads, and Puranas"
    },
    {
      icon: MessageCircle,
      title: "Interactive Conversations",
      description: "Engage in meaningful discussions about dharma and spirituality"
    },
    {
      icon: Star,
      title: "Authentic Sources",
      description: "All answers backed by traditional Hindu texts"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-full border border-orange-200 mb-6">
            <Sparkles className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-orange-700 font-medium">Powered by AI</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet <span className="text-orange-600">HinduGPT AI</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your intelligent companion for exploring Hindu wisdom and spirituality
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="lg:pl-8">
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 border-0 text-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Start Your Journey</h3>
                <p className="text-white/90 mb-8">
                  Ask questions, explore scriptures, and deepen your understanding of Hindu philosophy through AI-powered conversations.
                </p>
                
                <Link to="/chat">
                  <Button className="w-full bg-white text-orange-600 hover:bg-white/90 font-semibold py-3 text-lg">
                    Chat with HinduGPT
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/80">
                  <div>✓ 24/7 Available</div>
                  <div>✓ Authentic Sources</div>
                  <div>✓ Multi-language</div>
                  <div>✓ Personalized</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HinduGPTAI;
