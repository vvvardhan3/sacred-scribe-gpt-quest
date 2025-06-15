
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageCircle, BookOpen, Star, Zap, Globe } from 'lucide-react';

const HinduGPTAI = () => {
  const capabilities = [
    {
      icon: Brain,
      title: "Advanced Scripture Understanding",
      description: "Deep comprehension of Sanskrit texts, philosophical concepts, and spiritual teachings across all major Hindu scriptures.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: MessageCircle,
      title: "Contextual Conversations",
      description: "Engaging dialogues that understand your spiritual journey and provide personalized guidance based on ancient wisdom.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Multi-Scripture Knowledge",
      description: "Comprehensive knowledge spanning Vedas, Upanishads, Puranas, Epics, and philosophical treatises.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      title: "Authentic Citations",
      description: "Every answer comes with proper references to original texts, ensuring authenticity and scholarly accuracy.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Instant Wisdom Access",
      description: "Get immediate answers to complex philosophical questions with explanations tailored to your understanding level.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Cultural Context Awareness",
      description: "Understanding of historical, cultural, and regional variations in Hindu traditions and practices.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-red-100/30"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-orange-200 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-orange-700">Specialized Hindu Knowledge AI</span>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            Meet HinduGPT AI
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Our AI is specifically trained on thousands of years of Hindu wisdom, from ancient Vedic texts to modern interpretations. 
            It understands Sanskrit, philosophical concepts, and can engage in meaningful spiritual conversations while maintaining 
            the authenticity and depth of traditional teachings.
          </p>

          <div className="bg-white/60 backdrop-blur-sm border border-orange-200 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What Makes HinduGPT Special?</h3>
            <p className="text-gray-700 leading-relaxed">
              Unlike general AI models, HinduGPT is fine-tuned specifically for Hindu philosophy and spirituality. 
              It can explain complex concepts like Brahman, Maya, Dharma, and Karma with the nuance they deserve, 
              while adapting explanations to your level of understanding. Whether you're a beginner exploring 
              Hindu concepts or a scholar seeking deeper insights, HinduGPT provides accurate, respectful, 
              and enlightening responses.
            </p>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 transform hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${capability.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 group-hover:scale-110`}>
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-orange-600 transition-colors duration-300">
                  {capability.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {capability.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Experience AI-Powered Spiritual Learning</h3>
            <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
              Start your conversation with HinduGPT today and discover how ancient wisdom meets modern technology 
              to enhance your spiritual journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Multilingual Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Scholarly Accurate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Culturally Respectful</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HinduGPTAI;
