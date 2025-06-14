
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Play, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

const QuizCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      fetchQuizzes();
    }
  }, [category]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('category', decodeURIComponent(category || ''))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewQuiz = async () => {
    setGenerating(true);
    
    try {
      console.log('Generating quiz for category:', decodeURIComponent(category || ''));
      
      // Get the current session to ensure we have proper auth headers
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Please log in to generate a quiz');
      }

      console.log('User session found, calling edge function...');
      
      const { data, error } = await supabase.functions.invoke('quiz-generate', {
        body: { category: decodeURIComponent(category || '') },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      toast({
        title: "Quiz Generated!",
        description: "Your new quiz has been created successfully.",
      });

      // Refresh the quiz list
      fetchQuizzes();
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const deleteQuiz = async (quizId: string, quizTitle: string) => {
    setDeleting(quizId);
    
    try {
      console.log('Deleting quiz:', quizId);
      
      // First delete all questions for this quiz
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('quiz_id', quizId);
      
      if (questionsError) {
        console.error('Error deleting questions:', questionsError);
        throw new Error('Failed to delete quiz questions');
      }
      
      // Then delete the quiz itself
      const { error: quizError } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);
      
      if (quizError) {
        console.error('Error deleting quiz:', quizError);
        throw new Error('Failed to delete quiz');
      }

      toast({
        title: "Quiz Deleted",
        description: `"${quizTitle}" has been deleted successfully.`,
      });

      // Refresh the quiz list
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {decodeURIComponent(category || '')} Quizzes
          </h1>
          <p className="text-lg text-gray-600">
            Test your knowledge with AI-generated quizzes
          </p>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Quizzes Available</CardTitle>
              <CardDescription>
                There are no quizzes available for this category yet. Generate a new quiz to get started!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={generateNewQuiz} disabled={generating}>
                <Plus className="w-4 h-4 mr-2" />
                {generating ? 'Generating Quiz...' : 'Generate New Quiz'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{decodeURIComponent(category || '')} Quiz Collection</h2>
              <Button onClick={generateNewQuiz} disabled={generating}>
                <Plus className="w-4 h-4 mr-2" />
                {generating ? 'Generating...' : 'Generate New Quiz'}
              </Button>
            </div>

            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Created: {new Date(quiz.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Link to={`/quiz/play/${quiz.id}`}>
                          <Button>
                            <Play className="w-4 h-4 mr-2" />
                            Start Quiz
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="default"
                              disabled={deleting === quiz.id}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {deleting === quiz.id ? 'Deleting...' : 'Delete'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{quiz.title}"? This action cannot be undone and will permanently remove the quiz and all its questions.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteQuiz(quiz.id, quiz.title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Quiz
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizCategory;
