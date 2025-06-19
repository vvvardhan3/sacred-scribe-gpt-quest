
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
    onCreateNew();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Welcome to HinduGPT
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Your AI companion for exploring Hindu philosophy, scriptures, and spiritual wisdom
          </p>
        </div>

        {/* Start Conversation Button */}
        <Button
          onClick={handleStartConversation}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg px-8 py-4 text-lg font-semibold rounded-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Start Conversation
        </Button>

        {/* Suggestion Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
            Try asking about:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm border-orange-100 hover:border-orange-200 hover:scale-105"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700 text-left leading-relaxed">{suggestion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Icons */}
        <div className="flex justify-center space-x-8 pt-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Sacred Texts</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Philosophy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600">Guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
