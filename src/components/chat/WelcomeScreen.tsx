
import React from 'react';
import { Bot } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    "What does the Bhagavad Gita say about dharma?",
    "Explain the concept of karma in Hindu philosophy",
    "Tell me about the Upanishads",
    "What are the main teachings of the Ramayana?"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-6">
        <Bot className="w-10 h-10 text-orange-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to HinduGPT</h3>
      <p className="text-gray-600 mb-6 max-w-md">Start a conversation about Hindu scriptures, philosophy, and teachings. I'm here to help!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-3 text-sm text-left bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
