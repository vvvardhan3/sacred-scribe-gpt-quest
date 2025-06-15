import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { conversationDb } from '@/utils/conversationDatabase';

export const useMessageState = (activeConversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const loadedConversationRef = useRef<string | null>(null);

  // Load messages when active conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      console.log('Loading messages for conversation:', activeConversationId);
      
      if (!activeConversationId) {
        console.log('No active conversation, clearing messages');
        setMessages([]);
        setTitleGenerated(false);
        loadedConversationRef.current = null;
        return;
      }

      // Don't reload if we're already showing this conversation
      if (loadedConversationRef.current === activeConversationId) {
        console.log('Already loaded conversation:', activeConversationId);
        return;
      }

      setIsLoadingMessages(true);
      try {
        console.log('Fetching messages from database for conversation:', activeConversationId);
        const dbMessages = await conversationDb.getMessages(activeConversationId);
        console.log('Raw messages from database:', dbMessages);
        
        if (dbMessages && dbMessages.length > 0) {
          const messagesWithDates = dbMessages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            citations: msg.citations || [],
            timestamp: new Date(msg.created_at)
          }));
          console.log('Processed messages for display:', messagesWithDates);
          setMessages(messagesWithDates);
          setTitleGenerated(true);
        } else {
          console.log('No messages found in database for conversation:', activeConversationId);
          // Only clear messages if this is not a brand new conversation
          // If there are messages in state but none in DB, keep the state (new conversation case)
          if (loadedConversationRef.current !== null) {
            setMessages([]);
          }
          setTitleGenerated(false);
        }
        
        loadedConversationRef.current = activeConversationId;
      } catch (error) {
        console.error('Error loading messages:', error);
        // Don't clear messages on error
        setTitleGenerated(false);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  const addMessage = (message: Message) => {
    console.log('Adding message to state:', message);
    setMessages(prev => {
      const updated = [...prev, message];
      console.log('Updated messages state:', updated);
      return updated;
    });
  };

  const resetMessages = () => {
    console.log('Resetting messages');
    setMessages([]);
    setTitleGenerated(false);
    loadedConversationRef.current = null;
  };

  return {
    messages,
    addMessage,
    titleGenerated,
    setTitleGenerated,
    resetMessages,
    isLoadingMessages
  };
};
