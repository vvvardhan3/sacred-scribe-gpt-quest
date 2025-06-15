
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id: string;
  text: string;
  choices: string[];
  answer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
}

const QuizPlay = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Get state from navigation
  const state = location.state as { category?: string; mode?: 'generate' | 'play'; quizId?: string } | null;

  useEffect(() => {
    if (state?.mode === 'generate' && state.category) {
      generateNewQuiz(state.category);
    } else if (quizId || state?.quizId) {
      fetchQuizData(quizId || state?.quizId);
    } else {
      setLoading(false);
      toast({
        title: "Error",
        description: "No quiz specified",
        variant: "destructive"
      });
    }
  }, [quizId, state]);

  const generateNewQuiz = async (category: string) => {
    if (!user) return;

    setGenerating(true);
    setLoading(true);

    try {
      console.log('Generating quiz for category:', category);
      
      const { data, error } = await supabase.functions.invoke('quiz-generate', {
        body: { category },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Quiz generation error:', error);
        throw new Error(error.message || 'Failed to generate quiz');
      }

      if (!data.success || !data.quiz) {
        throw new Error('Failed to generate quiz');
      }

      console.log('Quiz generated successfully:', data.quiz);
      
      // Fetch the generated quiz
      await fetchQuizData(data.quiz.id);
      
      toast({
        title: "Quiz Generated!",
        description: `Your ${category} quiz has been created successfully.`,
      });
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setGenerating(false);
    }
  };

  const fetchQuizData = async (id?: string) => {
    if (!id) return;

    try {
      // Fetch quiz details
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (quizError) throw quizError;
      setQuiz(quizData);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id)
        .order('created_at', { ascending: true });

      if (questionsError) throw questionsError;
      
      // Transform the data to match our interface
      const transformedQuestions: Question[] = questionsData.map(q => ({
        id: q.id,
        text: q.text,
        choices: Array.isArray(q.choices) ? q.choices as string[] : [],
        answer: q.answer,
        explanation: q.explanation || ''
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !quiz) return;

    setSubmitting(true);
    try {
      // Calculate score
      let score = 0;
      questions.forEach(question => {
        const userAnswer = selectedAnswers[question.id];
        if (userAnswer === question.answer) {
          score++;
        }
      });

      // Save progress
      const { data: progressData, error } = await supabase
        .from('progress')
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          score,
          total_questions: questions.length,
          answers: selectedAnswers
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Quiz Completed!",
        description: `You scored ${score} out of ${questions.length}`,
      });

      navigate(`/quiz/results/${progressData.id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || generating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-lg font-semibold">
              {generating ? 'Generating your quiz...' : 'Loading quiz...'}
            </p>
            <p className="text-sm text-gray-600">
              {generating ? 'This may take a few moments' : 'Please wait'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The quiz you're looking for doesn't exist or has no questions.</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-semibold">{quiz.title}</h1>
              <p className="text-sm text-gray-600">{quiz.category}</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Quiz
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`choice-${index}`}
                    name="answer"
                    value={choice.charAt(0)}
                    checked={selectedAnswers[currentQ.id] === choice.charAt(0)}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <label
                    htmlFor={`choice-${index}`}
                    className="flex-1 cursor-pointer text-gray-700 hover:text-gray-900"
                  >
                    {choice}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPlay;
