
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressData {
  id: string;
  score: number;
  total_questions: number;
  completed_at: string;
  answers: { [key: string]: string };
  quiz: {
    id: string;
    title: string;
    category: string;
    description: string;
  };
}

interface Question {
  id: string;
  text: string;
  choices: string[];
  answer: string;
  explanation: string;
}

const QuizResults = () => {
  const { progressId } = useParams<{ progressId: string }>();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (progressId) {
      fetchResultsData();
    }
  }, [progressId]);

  const fetchResultsData = async () => {
    try {
      // Fetch progress data with quiz info
      const { data: progress, error: progressError } = await supabase
        .from('progress')
        .select(`
          *,
          quiz:quizzes(*)
        `)
        .eq('id', progressId)
        .single();

      if (progressError) throw progressError;
      setProgressData(progress);

      // Fetch questions for this quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', progress.quiz.id)
        .order('created_at');

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching results data:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz results",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Quiz results not found.</p>
            <Link to="/dashboard" className="block mt-4">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const percentage = Math.round((progressData.score / progressData.total_questions) * 100);
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to={`/quiz/category/${encodeURIComponent(progressData.quiz.category)}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Category
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Trophy className={`w-16 h-16 ${getScoreColor(percentage)}`} />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {progressData.score}/{progressData.total_questions}
              </div>
              <p className="text-gray-600">({percentage}% correct)</p>
            </div>
            <h3 className="text-lg font-semibold mb-2">{progressData.quiz.title}</h3>
            <p className="text-gray-600">
              Completed on {new Date(progressData.completed_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Review Your Answers</h2>
          
          {questions.map((question, index) => {
            const userAnswer = progressData.answers[question.id];
            const isCorrect = userAnswer === question.answer;
            
            return (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Question {index + 1}</span>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <CardTitle className="text-base">{question.text}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.choices.map((choice, choiceIndex) => {
                      const choiceLetter = choice.charAt(0);
                      const isUserChoice = userAnswer === choiceLetter;
                      const isCorrectChoice = question.answer === choiceLetter;
                      
                      let bgColor = 'bg-gray-50';
                      if (isCorrectChoice) {
                        bgColor = 'bg-green-100 border-green-500';
                      } else if (isUserChoice && !isCorrectChoice) {
                        bgColor = 'bg-red-100 border-red-500';
                      }
                      
                      return (
                        <div
                          key={choiceIndex}
                          className={`p-3 rounded-lg border ${bgColor}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{choice}</span>
                            {isUserChoice && (
                              <Badge variant={isCorrectChoice ? "default" : "destructive"}>
                                Your Answer
                              </Badge>
                            )}
                            {isCorrectChoice && (
                              <Badge variant="default" className="bg-green-600">
                                Correct
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to={`/quiz/category/${encodeURIComponent(progressData.quiz.category)}`}>
            <Button>Take Another Quiz</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
