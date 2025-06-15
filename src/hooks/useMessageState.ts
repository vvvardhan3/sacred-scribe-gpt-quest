
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { conversationDb } from '@/utils/conversationDatabase';

export const useMessageState = (
  activeConversationId: string | null,
  getActiveConversation: () => any
) => {
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
        // Load messages directly from database
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
          
          // Check if conversation has a custom title
          const activeConv = getActiveConversation();
          setTitleGenerated(!!activeConv?.title && activeConv.title !== 'New Conversation');
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

  const addMessage = (message: Message) => {
    console.log('Adding message to state:', message);
    setMessages(prev => {
      const newMessages = [...prev, message];
      console.log('Updated messages after adding:', newMessages);
      return newMessages;
    });
  };

  const updateMessages = (newMessages: Message[]) => {
    console.log('Updating all messages:', newMessages);
    setMessages(newMessages);
  };

  const resetMessages = () => {
    console.log('Resetting messages');
    setMessages([]);
    setTitleGenerated(false);
  };

  return {
    messages,
    setMessages: updateMessages,
    addMessage,
    titleGenerated,
    setTitleGenerated,
    resetMessages,
    isLoadingMessages
  };
};
