
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

// Mock the hooks
vi.mock('@/hooks/useUserLimits', () => ({
  useUserLimits: vi.fn(() => ({
    canCreateQuiz: vi.fn(() => true),
    usage: { quizzes_created_total: 0 },
    limits: { maxQuizzes: 5, subscriptionTier: 'free' },
    incrementQuizCount: vi.fn(),
    isCategoryAllowed: vi.fn((category) => category === 'Bhagavad Gita')
  }))
}));

vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: vi.fn(() => ({
    subscription: { subscribed: false, subscription_tier: 'free' },
    loading: false
  }))
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: { access_token: 'test' } } }))
    }
  }
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn())
  };
});

const DashboardWrapper = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
);

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard title correctly', async () => {
    render(<DashboardWrapper />);
    
    await waitFor(() => {
      expect(screen.getByText('Sacred Scripture Library')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    const { useSubscription } = require('@/hooks/useSubscription');
    useSubscription.mockReturnValue({
      subscription: null,
      loading: true
    });

    render(<DashboardWrapper />);
    
    expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
  });

  it('renders scripture categories correctly', async () => {
    render(<DashboardWrapper />);
    
    await waitFor(() => {
      expect(screen.getByText('Bhagavad Gita')).toBeInTheDocument();
      expect(screen.getByText('Upanishads')).toBeInTheDocument();
      expect(screen.getByText('Ramayana')).toBeInTheDocument();
    });
  });

  it('shows premium locked categories correctly', async () => {
    render(<DashboardWrapper />);
    
    await waitFor(() => {
      const premiumLabels = screen.getAllByText('Premium Access Required');
      expect(premiumLabels.length).toBeGreaterThan(0);
    });
  });

  it('shows upgrade CTA for free users', async () => {
    render(<DashboardWrapper />);
    
    await waitFor(() => {
      expect(screen.getByText('Unlock All Sacred Scriptures')).toBeInTheDocument();
    });
  });

  it('navigates to chat when clicking Start Conversation', async () => {
    const mockNavigate = vi.fn();
    const { useNavigate } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);

    render(<DashboardWrapper />);
    
    await waitFor(() => {
      const chatButton = screen.getByText('Start Conversation');
      fireEvent.click(chatButton);
      expect(mockNavigate).toHaveBeenCalledWith('/chat');
    });
  });
});
