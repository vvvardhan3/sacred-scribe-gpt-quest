
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Trophy, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  created_at: string;
}

interface Progress {
  id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

interface PreviousQuizzesProps {
  category: string;
}

export const PreviousQuizzes: React.FC<PreviousQuizzesProps> = ({ category }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: Progress }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchQuizzesAndProgress();
    }
  }, [user, category]);

  const fetchQuizzesAndProgress = async () => {
    if (!user) return;

    try {
      // Fetch quizzes for this category and user
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('category', category)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (quizzesError) throw quizzesError;

      setQuizzes(quizzesData || []);

      // Fetch progress for these quizzes
      if (quizzesData && quizzesData.length > 0) {
        const quizIds = quizzesData.map(quiz => quiz.id);
        const { data: progressData, error: progressError } = await supabase
          .from('progress')
          .select('*')
          .in('quiz_id', quizIds)
          .eq('user_id', user.id);

        if (progressError) throw progressError;

        // Create a map of quiz_id to latest progress
        const progressMap: { [key: string]: Progress } = {};
        progressData?.forEach(p => {
          if (!progressMap[p.quiz_id] || new Date(p.completed_at) > new Date(progressMap[p.quiz_id].completed_at)) {
            progressMap[p.quiz_id] = p;
          }
        });

        setProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching quizzes and progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayQuiz = (quizId: string) => {
    navigate(`/quiz/play/${quizId}`);
  };

  const handleViewResults = (progressId: string) => {
    navigate(`/quiz/results/${progressId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p>Loading your quizzes...</p>
        </CardContent>
      </Card>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No quizzes created yet for {category}.</p>
          <p className="text-sm text-gray-500 mt-2">Create your first quiz to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Previous {category} Quizzes ({quizzes.length})
      </h3>
      
      {quizzes.map((quiz) => {
        const quizProgress = progress[quiz.id];
        const hasProgress = !!quizProgress;
        
        return (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(quiz.created_at), { addSuffix: true })}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {hasProgress && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        Best Score: {quizProgress.score}/{quizProgress.total_questions}
                      </span>
                      <Badge 
                        variant={quizProgress.score === quizProgress.total_questions ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {Math.round((quizProgress.score / quizProgress.total_questions) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePlayQuiz(quiz.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {hasProgress ? 'Retake' : 'Play'}
                  </Button>
                  
                  {hasProgress && (
                    <Button
                      onClick={() => handleViewResults(quizProgress.id)}
                      variant="outline"
                    >
                      View Results
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
