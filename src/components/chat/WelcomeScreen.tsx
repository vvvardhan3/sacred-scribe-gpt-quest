
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
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">What can I help with?</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="p-4 h-auto text-left justify-start hover:bg-gray-50 border-gray-200"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="text-sm font-medium text-gray-700">
              {suggestion}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
