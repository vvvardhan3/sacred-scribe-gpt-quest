
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessageToAPI, createUserMessage, createAssistantMessage, createErrorMessage } from '@/utils/messageOperations';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('messageOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessageToAPI', () => {
    it('successfully sends message and returns response', async () => {
      const { supabase } = require('@/integrations/supabase/client');
      const mockResponse = {
        data: { answer: 'Test response', citations: ['Citation 1'] },
        error: null
      };
      supabase.functions.invoke.mockResolvedValue(mockResponse);

      const result = await sendMessageToAPI('test message');

      expect(result).toEqual({
        answer: 'Test response',
        citations: ['Citation 1']
      });
      expect(supabase.functions.invoke).toHaveBeenCalledWith('chat-ask', {
        body: { message: 'test message' }
      });
    });

    it('handles API errors gracefully', async () => {
      const { supabase } = require('@/integrations/supabase/client');
      supabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'API Error' }
      });

      await expect(sendMessageToAPI('test message')).rejects.toThrow('API Error');
    });

    it('handles missing response data', async () => {
      const { supabase } = require('@/integrations/supabase/client');
      supabase.functions.invoke.mockResolvedValue({
        data: null,
        error: null
      });

      await expect(sendMessageToAPI('test message')).rejects.toThrow('No response received from chat service');
    });
  });

  describe('createUserMessage', () => {
    it('creates user message with correct structure', () => {
      const message = createUserMessage('Hello world');

      expect(message).toMatchObject({
        role: 'user',
        content: 'Hello world',
        timestamp: expect.any(Date)
      });
      expect(message.id).toBeDefined();
    });
  });

  describe('createAssistantMessage', () => {
    it('creates assistant message with citations', () => {
      const message = createAssistantMessage('Response', ['Citation 1']);

      expect(message).toMatchObject({
        role: 'assistant',
        content: 'Response',
        citations: ['Citation 1'],
        timestamp: expect.any(Date)
      });
      expect(message.id).toBeDefined();
    });

    it('creates assistant message without citations', () => {
      const message = createAssistantMessage('Response');

      expect(message).toMatchObject({
        role: 'assistant',
        content: 'Response',
        citations: [],
        timestamp: expect.any(Date)
      });
    });
  });

  describe('createErrorMessage', () => {
    it('creates error message with standard text', () => {
      const message = createErrorMessage();

      expect(message).toMatchObject({
        role: 'assistant',
        content: "I apologize, but I'm unable to process your request at the moment. Please try again later.",
        timestamp: expect.any(Date)
      });
      expect(message.id).toBeDefined();
    });
  });
});
