
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuizCategory from '@/pages/QuizCategory';

// Mock the hooks and components
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
      getSession: vi.fn(() => Promise.resolve({ data: { session: { access_token: 'test' } } }))
    }
  }
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({ category: 'vedas' })),
    useNavigate: vi.fn(() => vi.fn())
  };
});

const QuizCategoryWrapper = () => (
  <BrowserRouter>
    <QuizCategory />
  </BrowserRouter>
);

describe('QuizCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders category information correctly', () => {
    render(<QuizCategoryWrapper />);
    
    expect(screen.getByText('Vedas')).toBeInTheDocument();
    expect(screen.getByText(/Test your knowledge of the four Vedas/)).toBeInTheDocument();
  });

  it('shows "Category Not Found" for invalid categories', () => {
    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ category: 'invalid-category' });
    
    render(<QuizCategoryWrapper />);
    
    expect(screen.getByText(/Category Not Found/)).toBeInTheDocument();
  });

  it('handles quiz creation button click', async () => {
    const mockInvoke = vi.fn().mockResolvedValue({
      data: { success: true, quiz: { id: 'test-quiz-id' } }
    });
    
    const { supabase } = require('@/integrations/supabase/client');
    supabase.functions.invoke = mockInvoke;
    
    render(<QuizCategoryWrapper />);
    
    const createButton = screen.getByText('Create Quiz');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('quiz-generate', expect.any(Object));
    });
  });
});
