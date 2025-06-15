
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    "What does the Bhagavad Gita say about dharma?",
    "Explain the concept of moksha in Hindu philosophy",
    "What are the main teachings of the Upanishads?",
    "How does karma work according to Hindu scriptures?"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">What can I help with?</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Ask me anything about Hindu scriptures and philosophy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="p-6 h-auto text-left justify-start hover:bg-gray-50 hover:border-gray-300 border-gray-200 transition-all duration-200 group shadow-sm hover:shadow-md"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-orange-500 mt-0.5 group-hover:text-orange-600 transition-colors" />
              <div className="text-sm font-medium text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                {suggestion}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
