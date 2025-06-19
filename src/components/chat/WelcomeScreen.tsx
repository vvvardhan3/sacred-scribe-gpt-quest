
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Sparkles, BookOpen, Heart } from 'lucide-react';

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
    "Explain the concept of Dharma in everyday life",
    "What are the main teachings of the Bhagavad Gita?",
    "How can I practice mindfulness through Hindu traditions?"
  ];

  const handleStartConversation = () => {
    console.log('Starting conversation...');
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Start Conversation Button */}
        <Button
          onClick={handleStartConversation}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg px-8 py-4 text-lg font-semibold rounded-xl"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Start Conversation
        </Button>

        {/* Suggestion Cards */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">Try asking about:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm border-orange-100 hover:border-orange-200"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700 text-left">{suggestion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
