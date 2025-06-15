
import React from 'react';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      text: "What does the Bhagavad Gita say about dharma?",
      category: "Scripture"
    },
    {
      text: "Explain the concept of moksha in Hindu philosophy",
      category: "Philosophy"
    },
    {
      text: "What are the main teachings of the Upanishads?",
      category: "Scripture"
    },
    {
      text: "How does karma work according to Hindu scriptures?",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => {
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => onSuggestionClick(suggestion.text)}
              >
                <div className="text-left">
                  <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">
                    {suggestion.category}
                  </div>
                  <div className="text-sm font-medium text-gray-800 leading-relaxed">
                    {suggestion.text}
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
