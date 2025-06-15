
import React from 'react';
import { BookOpen, Sparkles, MessageCircle } from 'lucide-react';

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          What can I help with?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the wisdom of Hindu scriptures and philosophy through our AI-powered assistant
        </p>
      </div>

      {/* Suggestions Section */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Popular Questions
        </h2>
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
    </div>
  );
};

export default WelcomeScreen;
