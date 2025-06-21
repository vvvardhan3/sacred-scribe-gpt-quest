
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatMessages } from '@/hooks/useChatMessages';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}));

vi.mock('@/hooks/useMessageState', () => ({
  useMessageState: vi.fn(() => ({
    messages: [],
    addMessage: vi.fn(),
    titleGenerated: false,
    setTitleGenerated: vi.fn(),
    resetMessages: vi.fn(),
    isLoadingMessages: false
  }))
}));

vi.mock('@/hooks/useUserLimits', () => ({
  useUserLimits: vi.fn(() => ({
    canSendMessage: vi.fn(() => true),
    incrementMessageCount: vi.fn(),
    limits: { maxDailyMessages: 10, subscriptionTier: 'free' },
    usage: { messages_sent_today: 0 }
  }))
}));

vi.mock('@/utils/messageOperations', () => ({
  sendMessageToAPI: vi.fn(),
  createUserMessage: vi.fn(() => ({ id: '1', role: 'user', content: 'test', timestamp: new Date() })),
  createAssistantMessage: vi.fn(() => ({ id: '2', role: 'assistant', content: 'response', timestamp: new Date() })),
  createErrorMessage: vi.fn(() => ({ id: '3', role: 'assistant', content: 'error', timestamp: new Date() }))
}));

vi.mock('@/utils/conversationDatabase', () => ({
  conversationDb: {
    saveMessage: vi.fn(),
    saveMessages: vi.fn(),
    updateConversation: vi.fn()
  }
}));

describe('useChatMessages', () => {
  const mockGetActiveConversation = vi.fn();
  const mockUpdateConversation = vi.fn();
  const mockCreateNewConversation = vi.fn(() => Promise.resolve('new-conversation-id'));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => 
      useChatMessages(
        'test-conversation',
        mockGetActiveConversation,
        mockUpdateConversation,
        mockCreateNewConversation
      )
    );

    expect(result.current.input).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  it('updates input value', () => {
    const { result } = renderHook(() => 
      useChatMessages(
        'test-conversation',
        mockGetActiveConversation,
        mockUpdateConversation,
        mockCreateNewConversation
      )
    );

    act(() => {
      result.current.setInput('test message');
    });

    expect(result.current.input).toBe('test message');
  });

  it('handles suggestion click', () => {
    const { result } = renderHook(() => 
      useChatMessages(
        'test-conversation',
        mockGetActiveConversation,
        mockUpdateConversation,
        mockCreateNewConversation
      )
    );

    act(() => {
      result.current.handleSuggestionClick('suggested message');
    });

    expect(result.current.input).toBe('suggested message');
  });

  it('toggles citations', () => {
    const { result } = renderHook(() => 
      useChatMessages(
        'test-conversation',
        mockGetActiveConversation,
        mockUpdateConversation,
        mockCreateNewConversation
      )
    );

    act(() => {
      result.current.toggleCitations('message-1');
    });

    expect(result.current.expandedCitations['message-1']).toBe(true);

    act(() => {
      result.current.toggleCitations('message-1');
    });

    expect(result.current.expandedCitations['message-1']).toBe(false);
  });

  it('resets chat state', () => {
    const { result } = renderHook(() => 
      useChatMessages(
        'test-conversation',
        mockGetActiveConversation,
        mockUpdateConversation,
        mockCreateNewConversation
      )
    );

    act(() => {
      result.current.setInput('test');
      result.current.toggleCitations('msg-1');
    });

    act(() => {
      result.current.resetChat();
    });

    expect(result.current.input).toBe('');
    expect(result.current.expandedCitations).toEqual({});
    expect(result.current.loading).toBe(false);
  });
});
