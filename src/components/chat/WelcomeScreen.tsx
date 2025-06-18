
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

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">हिं</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Welcome to HinduGPT
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Your AI companion for exploring Hindu philosophy, scriptures, and spiritual wisdom
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <Card className="bg-white/70 backdrop-blur-sm border-orange-100">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Sacred Texts</h3>
              <p className="text-sm text-gray-600">Explore Vedas, Upanishads, and Puranas</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-orange-100">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Philosophy</h3>
              <p className="text-sm text-gray-600">Understand complex spiritual concepts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-orange-100">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Guidance</h3>
              <p className="text-sm text-gray-600">Get spiritual guidance for daily life</p>
            </CardContent>
          </Card>
        </div>

        {/* Start Conversation Button */}
        <Button
          onClick={onCreateNew}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
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
