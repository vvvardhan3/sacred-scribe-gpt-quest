
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeScreenProps {
  onCreateNew: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onCreateNew,
  onSuggestionClick
}) => {
  const suggestions = [
    "What is the significance of Om in Hindu philosophy?",
    "Explain the concept of Dharma in everyday life?",
    "What are the main teachings of the Bhagavad Gita?",
    "How can I practice mindfulness through Hindu traditions?"
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border-orange-100 hover:border-orange-200 hover:scale-105"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <CardContent className="p-4">
                <p className="text-sm text-gray-700 text-left leading-relaxed">{suggestion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
