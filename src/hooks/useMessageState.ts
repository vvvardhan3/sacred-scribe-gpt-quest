
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { conversationDb } from '@/utils/conversationDatabase';

export const useMessageState = (
  activeConversationId: string | null,
  getActiveConversation: () => any
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [titleGenerated, setTitleGenerated] = useState(false);

  // Load messages when active conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      console.log('Loading messages for conversation:', activeConversationId);
      if (activeConversationId) {
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
            console.log('No messages found in database, resetting');
            setMessages([]);
            setTitleGenerated(false);
          }
        } catch (error) {
          console.error('Error loading messages:', error);
          setMessages([]);
          setTitleGenerated(false);
        }
      } else {
        console.log('No active conversation, resetting');
        setMessages([]);
        setTitleGenerated(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  const resetMessages = () => {
    setMessages([]);
    setTitleGenerated(false);
  };

  return {
    messages,
    setMessages,
    titleGenerated,
    setTitleGenerated,
    resetMessages
  };
};
