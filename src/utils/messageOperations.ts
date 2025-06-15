
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

export const sendMessageToAPI = async (message: string): Promise<{ answer: string; citations?: string[] }> => {
  console.log('Sending message to chat-ask function:', message);

  const { data, error } = await supabase.functions.invoke('chat-ask', {
    body: { message }
  });

  if (error) {
    console.error('Supabase function error:', error);
    throw error;
  }

  console.log('Received response:', data);
  return data;
};

// Generate proper UUIDs for message IDs
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
