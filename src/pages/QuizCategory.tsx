
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Sparkles,
  Clock,
  Trophy,
  Target
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useUserLimits } from '@/hooks/useUserLimits';
import FeedbackButton from '@/components/FeedbackButton';

const QuizCategory = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(5);
  const { limits, isCategoryAllowed } = useUserLimits();

  const decodedCategory = category ? decodeURIComponent(category) : '';
  const isAllowed = isCategoryAllowed(decodedCategory);

  const categoryDescriptions: { [key: string]: string } = {
    'Bhagavad Gita': 'Explore the profound teachings of Lord Krishna to Arjuna on the battlefield of Kurukshetra. Test your understanding of dharma, karma, and the paths to moksha.',
    'Upanishads': 'Dive deep into the philosophical foundations of Vedantic thought. Challenge yourself with questions on Brahman, Atman, and the ultimate reality.',
    'Ramayana': 'Journey through the epic tale of Lord Rama, Sita, and Hanuman. Test your knowledge of dharma, devotion, and righteous living.',
    'Mahabharata': 'Explore the great epic of the Bharata dynasty. From the Kurukshetra war to timeless moral dilemmas, test your understanding of this vast narrative.',
    'Puranas': 'Discover the ancient stories of gods, goddesses, and cosmic cycles. Test your knowledge of creation myths, divine incarnations, and sacred histories.',
    'Vedas': 'Challenge yourself with the oldest scriptures of Hinduism. From Rigveda hymns to Yajurveda rituals, explore the foundation of Vedic knowledge.'
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Beginner', icon: '🌱', description: 'Basic concepts and well-known stories' },
    { value: 'medium', label: 'Intermediate', icon: '🌿', description: 'Moderate difficulty with deeper insights' },
    { value: 'hard', label: 'Advanced', icon: '🌳', description: 'Complex philosophical concepts' }
  ];

  const questionCountOptions = [5, 10, 15, 20];

  const handleStartQuiz = () => {
    if (!selectedDifficulty) {
      alert('Please select a difficulty level');
      return;
    }

    // Fixed: Properly encode the category and create query parameters
    const encodedCategory = encodeURIComponent(decodedCategory);
    const queryParams = new URLSearchParams({
      category: encodedCategory,
      difficulty: selectedDifficulty,
      questionCount: selectedQuestionCount.toString()
    });

    console.log('Starting quiz with params:', {
      category: encodedCategory,
      difficulty: selectedDifficulty,
      questionCount: selectedQuestionCount
    });

    navigate(`/quiz/play?${queryParams.toString()}`);
  };

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <Card className="text-center p-12 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Premium Access Required
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {decodedCategory} quizzes are available with our premium plans. 
                Upgrade to access all sacred scriptures and unlimited quiz creation.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => navigate('/billing')}
                  className="bg-orange-600 hover:bg-orange-700 px-8 py-3"
                >
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="fixed bottom-6 right-6">
            <FeedbackButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="text-center">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Sacred Scripture
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent mb-4">
              {decodedCategory}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {categoryDescriptions[decodedCategory] || 'Explore this sacred scripture through interactive quizzes designed to deepen your spiritual understanding.'}
            </p>
          </div>
        </div>

        {/* Quiz Configuration */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Difficulty Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-orange-600" />
                Choose Difficulty Level
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDifficulty(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedDifficulty === option.value
                        ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <span className="font-semibold text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Number of Questions
              </h3>
              <div className="flex flex-wrap gap-3">
                {questionCountOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedQuestionCount(count)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      selectedQuestionCount === count
                        ? 'bg-orange-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    {count} Questions
                    <span className="block text-xs opacity-75">
                      ~{Math.ceil(count * 1.5)} min
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button
                onClick={handleStartQuiz}
                disabled={!selectedDifficulty}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Play className="w-5 h-5 mr-2" />
                Start {decodedCategory} Quiz
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              
              {!selectedDifficulty && (
                <p className="text-sm text-gray-500 mt-3">
                  Please select a difficulty level to begin
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Button */}
        <div className="fixed bottom-6 right-6">
          <FeedbackButton />
        </div>
      </div>
    </div>
  );
};

export default QuizCategory;
