
import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';

export const useMessageState = (
  activeConversationId: string | null,
  getActiveConversation: () => any
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [titleGenerated, setTitleGenerated] = useState(false);

  // Load messages when active conversation changes
  useEffect(() => {
    console.log('Loading messages for conversation:', activeConversationId);
    if (activeConversationId) {
      const activeConv = getActiveConversation();
      if (activeConv && activeConv.messages && activeConv.messages.length > 0) {
        const messagesWithDates = activeConv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        console.log('Loaded messages:', messagesWithDates);
        setMessages(messagesWithDates);
        setTitleGenerated(!!activeConv.title && activeConv.title !== 'New Conversation');
      } else {
        console.log('No messages in conversation, keeping current messages');
        setTitleGenerated(false);
      }
    } else {
      console.log('No active conversation, resetting');
      setMessages([]);
      setTitleGenerated(false);
    }
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
