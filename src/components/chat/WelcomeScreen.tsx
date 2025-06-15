
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, MessageCircle, BookOpen } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      text: "What does the Bhagavad Gita say about dharma?",
      icon: BookOpen,
      category: "Scripture"
    },
    {
      text: "Explain the concept of moksha in Hindu philosophy",
      icon: Sparkles,
      category: "Philosophy"
    },
    {
      text: "What are the main teachings of the Upanishads?",
      icon: BookOpen,
      category: "Scripture"
    },
    {
      text: "How does karma work according to Hindu scriptures?",
      icon: MessageCircle,
      category: "Concept"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center px-8 py-12">
      {/* Header Section */}
      <div className="mb-16">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          What can I help with?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover the wisdom of Hindu scriptures and philosophy through our AI-powered assistant
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((suggestion, index) => {
            const IconComponent = suggestion.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="group relative p-8 h-auto text-left justify-start hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:border-orange-200 border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
                onClick={() => onSuggestionClick(suggestion.text)}
              >
                <div className="flex items-start space-x-4 w-full">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-orange-600 group-hover:text-orange-700 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2 group-hover:text-orange-700 transition-colors">
                      {suggestion.category}
                    </div>
                    <div className="text-base font-medium text-gray-800 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {suggestion.text}
                    </div>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Get started by selecting a question above or ask your own
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Authentic Sources</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Instant Answers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
