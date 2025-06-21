
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuizCategory from '@/pages/QuizCategory';

vi.mock('@/hooks/useUserLimits', () => ({
  useUserLimits: vi.fn(() => ({
    canCreateQuiz: vi.fn(() => true),
    usage: { quizzes_created_total: 0 },
    limits: { maxQuizzes: 5, subscriptionTier: 'free' },
    incrementQuizCount: vi.fn(),
    isCategoryAllowed: vi.fn(() => true)
  }))
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    },
    auth: {
      getSession: vi.fn(() => Promise.resolve({ 
        data: { session: { access_token: 'test', user: { id: 'user-123' } } } 
      }))
    }
  }
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({ category: 'Bhagavad Gita' })),
    useNavigate: vi.fn(() => vi.fn())
  };
});

const QuizWrapper = () => (
  <BrowserRouter>
    <QuizCategory />
  </BrowserRouter>
);

describe('Quiz Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders category information correctly', () => {
    render(<QuizWrapper />);
    
    expect(screen.getByText('Bhagavad Gita')).toBeInTheDocument();
    expect(screen.getByText(/Test your knowledge of Krishna/)).toBeInTheDocument();
  });

  it('shows quiz creation form', () => {
    render(<QuizWrapper />);
    
    expect(screen.getByText('Create Your Quiz')).toBeInTheDocument();
    expect(screen.getByText('10 Questions')).toBeInTheDocument();
    expect(screen.getByText('10-15 minutes')).toBeInTheDocument();
  });

  it('handles successful quiz creation', async () => {
    const mockNavigate = vi.fn();
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);

    const mockInvoke = vi.fn().mockResolvedValue({
      data: { 
        success: true, 
        quiz: { 
          id: 'quiz-123',
          title: 'Bhagavad Gita Quiz',
          questions: []
        } 
      }
    });
    
    const { supabase } = require('@/integrations/supabase/client');
    supabase.functions.invoke = mockInvoke;
    
    render(<QuizWrapper />);
    
    const createButton = screen.getByText('Create Quiz');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('quiz-generate', {
        body: {
          category: 'Bhagavad Gita',
          difficulty: 'medium',
          questionCount: 10
        }
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/quiz/play/quiz-123');
    });
  });

  it('handles quiz creation failure gracefully', async () => {
    const mockToast = vi.fn();
    const { useToast } = require('@/hooks/use-toast');
    useToast.mockReturnValue({ toast: mockToast });

    const mockInvoke = vi.fn().mockRejectedValue(new Error('Failed to create quiz'));
    
    const { supabase } = require('@/integrations/supabase/client');
    supabase.functions.invoke = mockInvoke;
    
    render(<QuizWrapper />);
    
    const createButton = screen.getByText('Create Quiz');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error Creating Quiz",
        description: "Failed to create quiz",
        variant: "destructive",
      });
    });
  });

  it('shows loading state during quiz creation', async () => {
    const mockInvoke = vi.fn(() => new Promise(resolve => 
      setTimeout(() => resolve({ data: { success: true, quiz: { id: 'test' } } }), 100)
    ));
    
    const { supabase } = require('@/integrations/supabase/client');
    supabase.functions.invoke = mockInvoke;
    
    render(<QuizWrapper />);
    
    const createButton = screen.getByText('Create Quiz');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Creating Quiz...')).toBeInTheDocument();
  });

  it('handles category not found correctly', () => {
    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ category: 'NonExistentCategory' });
    
    render(<QuizWrapper />);
    
    expect(screen.getByText(/Category Not Found/)).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('shows premium requirement for locked categories', () => {
    const { useUserLimits } = require('@/hooks/useUserLimits');
    useUserLimits.mockReturnValue({
      canCreateQuiz: vi.fn(() => true),
      usage: { quizzes_created_total: 0 },
      limits: { maxQuizzes: 5, subscriptionTier: 'free' },
      incrementQuizCount: vi.fn(),
      isCategoryAllowed: vi.fn(() => false) // Category is locked
    });

    render(<QuizWrapper />);
    
    expect(screen.getByText('Premium Category')).toBeInTheDocument();
    expect(screen.getByText(/Upgrade to Devotee or Guru plan/)).toBeInTheDocument();
  });

  it('handles quiz limit reached', async () => {
    const mockToast = vi.fn();
    const { useToast } = require('@/hooks/use-toast');
    useToast.mockReturnValue({ toast: mockToast });

    const { useUserLimits } = require('@/hooks/useUserLimits');
    useUserLimits.mockReturnValue({
      canCreateQuiz: vi.fn(() => false), // Limit reached
      usage: { quizzes_created_total: 5 },
      limits: { maxQuizzes: 5, subscriptionTier: 'free' },
      incrementQuizCount: vi.fn(),
      isCategoryAllowed: vi.fn(() => true)
    });

    render(<QuizWrapper />);
    
    const createButton = screen.getByText('Create Quiz');
    fireEvent.click(createButton);
    
    expect(mockToast).toHaveBeenCalledWith({
      title: "Quiz Limit Reached",
      description: "You've reached your quiz limit. Please upgrade your plan to create more quizzes.",
      variant: "destructive",
    });
  });
});
