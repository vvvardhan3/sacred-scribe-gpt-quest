
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

// Generate proper UUIDs for message IDs using crypto.randomUUID()
const generateMessageId = (): string => {
  return crypto.randomUUID();
};

export const createUserMessage = (content: string): Message => ({
  id: generateMessageId(),
  role: 'user',
  content,
  timestamp: new Date()
});

export const createAssistantMessage = (content: string, citations?: string[]): Message => ({
  id: generateMessageId(),
  role: 'assistant',
  content,
  citations: citations || [],
  timestamp: new Date()
});

export const createErrorMessage = (): Message => ({
  id: generateMessageId(),
  role: 'assistant',
  content: "I apologize, but I'm unable to process your request at the moment. Please try again later.",
  timestamp: new Date()
});
