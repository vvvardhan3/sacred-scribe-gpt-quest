
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

export const sendMessageToAPI = async (message: string): Promise<{ answer: string; citations?: string[] }> => {
  console.log('Sending message to chat-ask function:', message);

  try {
    const { data, error } = await supabase.functions.invoke('chat-ask', {
      body: { message }
    });

    console.log('Supabase function response:', { data, error });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to get response from chat service');
    }

    if (!data) {
      console.error('No data received from chat service');
      throw new Error('No response received from chat service');
    }

    // Handle both direct response and nested response formats
    const response = data.answer ? data : (data.data || data);
    
    if (!response.answer) {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from chat service');
    }

    console.log('Successfully processed response:', response);
    return {
      answer: response.answer,
      citations: response.citations || []
    };
  } catch (error: any) {
    console.error('Error in sendMessageToAPI:', error);
    
    // Re-throw with more context
    if (error.message) {
      throw error;
    } else {
      throw new Error('Failed to communicate with chat service');
    }
  }
};

// Enhanced UUID generation with timestamp to ensure uniqueness
const generateMessageId = (): string => {
  // Use crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    const uuid = crypto.randomUUID();
    console.log('Generated UUID:', uuid);
    return uuid;
  }
  
  // Fallback UUID generation with timestamp for extra uniqueness
  const timestamp = Date.now().toString(36);
  const randomPart = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  const uuid = `${timestamp}-${randomPart}`;
  console.log('Generated fallback UUID:', uuid);
  return uuid;
};

export const createUserMessage = (content: string): Message => {
  const id = generateMessageId();
  const message = {
    id,
    role: 'user' as const,
    content,
    timestamp: new Date()
  };
  console.log('Created user message:', message);
  return message;
};

export const createAssistantMessage = (content: string, citations?: string[]): Message => {
  const id = generateMessageId();
  const message = {
    id,
    role: 'assistant' as const,
    content,
    citations: citations || [],
    timestamp: new Date()
  };
  console.log('Created assistant message:', message);
  return message;
};

export const createErrorMessage = (): Message => {
  const id = generateMessageId();
  const message = {
    id,
    role: 'assistant' as const,
    content: "I apologize, but I'm unable to process your request at the moment. Please try again later.",
    timestamp: new Date()
  };
  console.log('Created error message:', message);
  return message;
};
