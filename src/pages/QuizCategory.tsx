
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Play, Plus, Trash2, BookOpen, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="text-gray-600 font-medium">Loading quizzes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="mr-4 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {decodeURIComponent(category || '')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Test your knowledge with AI-generated quizzes and deepen your understanding of ancient wisdom
            </p>
          </div>
        </div>

        {/* Content Section */}
        {quizzes.length === 0 ? (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">No Quizzes Available</CardTitle>
                <CardDescription className="text-gray-600">
                  There are no quizzes available for this category yet. Generate your first quiz to get started!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={generateNewQuiz} 
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {generating ? 'Generating Quiz...' : 'Generate Your First Quiz'}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with Generate Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Quiz Collection
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({quizzes.length} quiz{quizzes.length !== 1 ? 'es' : ''})
                </span>
              </h2>
              <Button 
                onClick={generateNewQuiz} 
                disabled={generating}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {generating ? 'Generating...' : 'Generate New Quiz'}
              </Button>
            </div>

            {/* Quiz Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(quiz.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-orange-600 transition-colors">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Link to={`/quiz/play/${quiz.id}`} className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="default"
                            disabled={deleting === quiz.id}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCategory;
