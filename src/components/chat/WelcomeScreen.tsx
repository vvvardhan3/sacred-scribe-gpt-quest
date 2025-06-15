
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
      <div className="mb-12">
        <div className="relative mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          What can I help with?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the wisdom of Hindu scriptures and philosophy through our AI-powered assistant
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="w-full max-w-4xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => {
            const IconComponent = suggestion.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => onSuggestionClick(suggestion.text)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <IconComponent className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">
                      {suggestion.category}
                    </div>
                    <div className="text-sm font-medium text-gray-800 leading-relaxed">
                      {suggestion.text}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center">
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
  );
};

export default WelcomeScreen;
