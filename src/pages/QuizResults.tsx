
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  text: string;
  choices: string[];
  answer: string;
  explanation: string;
}

interface ProgressData {
  id: string;
  score: number;
  total_questions: number;
  answers: { [key: string]: string };
  completed_at: string;
  quiz: {
    id: string;
    title: string;
    category: string;
    description: string;
  };
}

const QuizResults = () => {
  const { progressId } = useParams<{ progressId: string }>();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (progressId) {
      fetchResults();
    }
  }, [progressId]);

  const fetchResults = async () => {
    try {
      // Fetch progress data with quiz info
      const { data: progressData, error: progressError } = await supabase
        .from('progress')
        .select(`
          *,
          quiz:quizzes(*)
        `)
        .eq('id', progressId)
        .single();

      if (progressError) throw progressError;
      
      // Transform the data to match our interface
      const transformedProgress: ProgressData = {
        id: progressData.id,
        score: progressData.score,
        total_questions: progressData.total_questions,
        answers: typeof progressData.answers === 'object' ? progressData.answers as { [key: string]: string } : {},
        completed_at: progressData.completed_at,
        quiz: {
          id: progressData.quiz.id,
          title: progressData.quiz.title,
          category: progressData.quiz.category,
          description: progressData.quiz.description
        }
      };
      
      setProgress(transformedProgress);

      // Fetch questions for this quiz
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', transformedProgress.quiz.id)
        .order('created_at', { ascending: true });

      if (questionsError) throw questionsError;
      
      // Transform questions data
      const transformedQuestions: Question[] = questionsData.map(q => ({
        id: q.id,
        text: q.text,
        choices: Array.isArray(q.choices) ? q.choices as string[] : [],
        answer: q.answer,
        explanation: q.explanation || ''
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      console.error('Error fetching results:', error);
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

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Results Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The quiz results you're looking for don't exist.</p>
            <Link to="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scorePercentage = Math.round((progress.score / progress.total_questions) * 100);
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Quiz Results</CardTitle>
            <CardDescription className="text-lg">{progress.quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(scorePercentage)}`}>
                {progress.score}/{progress.total_questions}
              </div>
              <Badge variant={getScoreBadgeVariant(scorePercentage)} className="text-sm px-3 py-1">
                {scorePercentage}% Score
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              Completed on {new Date(progress.completed_at).toLocaleDateString()}
            </p>
            <div className="flex justify-center gap-4">
              <Link to={`/quiz/play/${progress.quiz.id}`}>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              </Link>
              <Link to={`/quiz/category/${encodeURIComponent(progress.quiz.category)}`}>
                <Button>
                  More {progress.quiz.category} Quizzes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Question Review</h2>
          {questions.map((question, index) => {
            const userAnswer = progress.answers[question.id];
            const isCorrect = userAnswer === question.answer;
            
            return (
              <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex-1">
                      Question {index + 1}: {question.text}
                    </CardTitle>
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {question.choices.map((choice, choiceIndex) => {
                      const choiceKey = choice.charAt(0);
                      const isUserAnswer = userAnswer === choiceKey;
                      const isCorrectAnswer = question.answer === choiceKey;
                      
                      let className = "p-2 rounded border ";
                      if (isCorrectAnswer) {
                        className += "bg-green-100 border-green-300 text-green-800";
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        className += "bg-red-100 border-red-300 text-red-800";
                      } else {
                        className += "bg-gray-50 border-gray-200";
                      }
                      
                      return (
                        <div key={choiceIndex} className={className}>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{choice.charAt(0)})</span>
                            <span>{choice.substring(3)}</span>
                            {isUserAnswer && (
                              <Badge variant="outline" className="ml-auto">
                                Your Answer
                              </Badge>
                            )}
                            {isCorrectAnswer && (
                              <Badge variant="default" className="ml-2">
                                Correct
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {question.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <h4 className="font-medium text-blue-900 mb-1">Explanation:</h4>
                      <p className="text-blue-800 text-sm">{question.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
