
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { generateTitle } from './titleGenerator';

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

export const createUserMessage = (content: string): Message => ({
  id: Date.now().toString(),
  role: 'user',
  content,
  timestamp: new Date()
});

export const createAssistantMessage = (content: string, citations?: string[]): Message => ({
  id: (Date.now() + 1).toString(),
  role: 'assistant',
  content,
  citations: citations || [],
  timestamp: new Date()
});

export const createErrorMessage = (): Message => ({
  id: (Date.now() + 1).toString(),
  role: 'assistant',
  content: "I apologize, but I'm unable to process your request at the moment. Please try again later.",
  timestamp: new Date()
});

export const handleTitleGeneration = async (
  messages: Message[],
  activeConversationId: string,
  titleGenerated: boolean,
  setTitleGenerated: (value: boolean) => void,
  updateConversation: (id: string, updates: any) => void,
  getActiveConversation: () => any
) => {
  if (activeConversationId && messages.length > 0) {
    console.log('Saving messages to conversation:', activeConversationId, messages);
    
    // Filter only user messages for sidebar display
    const userMessages = messages.filter(msg => msg.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];
    
    const currentConv = getActiveConversation();
    let title = currentConv?.title || 'New Conversation';
    
    // Generate AI title only for the first user message and only once
    if (messages.length >= 1 && messages[0].role === 'user' && !titleGenerated) {
      setTitleGenerated(true);
      try {
        const generatedTitle = await generateTitle(messages[0].content);
        updateConversation(activeConversationId, {
          messages,
          lastMessage: lastUserMessage ? lastUserMessage.content.slice(0, 100) : 'No messages yet',
          title: generatedTitle
        });
      } catch (error) {
        console.error('Error generating title:', error);
        updateConversation(activeConversationId, {
          messages,
          lastMessage: lastUserMessage ? lastUserMessage.content.slice(0, 100) : 'No messages yet',
          title
        });
      }
      return;
    }
    
    updateConversation(activeConversationId, {
      messages,
      lastMessage: lastUserMessage ? lastUserMessage.content.slice(0, 100) : 'No messages yet',
      title
    });
  }
};
