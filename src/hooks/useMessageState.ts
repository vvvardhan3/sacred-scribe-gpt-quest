
import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/chat';
import { conversationDb } from '@/utils/conversationDatabase';

export const useMessageState = (activeConversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Load messages when active conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      console.log('Loading messages for conversation:', activeConversationId);
      
      if (!activeConversationId) {
        console.log('No active conversation, resetting');
        setMessages([]);
        setTitleGenerated(false);
        return;
      }

      setIsLoadingMessages(true);
      try {
        const dbMessages = await conversationDb.getMessages(activeConversationId);
        
        if (dbMessages && dbMessages.length > 0) {
          const messagesWithDates = dbMessages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            citations: msg.citations || [],
            timestamp: new Date(msg.created_at)
          }));
          console.log('Loaded messages from database:', messagesWithDates);
          setMessages(messagesWithDates);
          setTitleGenerated(true); // If messages exist, title should be generated
        } else {
          console.log('No messages found in database for conversation:', activeConversationId);
          setMessages([]);
          setTitleGenerated(false);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
        setTitleGenerated(false);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  const addMessage = useCallback((message: Message) => {
    console.log('Adding message to state:', message);
    setMessages(prev => [...prev, message]);
  }, []);

  const resetMessages = useCallback(() => {
    console.log('Resetting messages');
    setMessages([]);
    setTitleGenerated(false);
  }, []);

  return {
    messages,
    addMessage,
    titleGenerated,
    setTitleGenerated,
    resetMessages,
    isLoadingMessages
  };
};
