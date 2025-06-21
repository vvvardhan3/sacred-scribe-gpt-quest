
import { useState, useEffect } from 'react';
import { conversationDb, DatabaseMessage } from '@/utils/conversationDatabase';
import { Message } from '@/types/chat';

export const useConversationMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const dbMessages = await conversationDb.getMessages(conversationId);
        
        // Convert database messages to Message format
        const convertedMessages: Message[] = dbMessages.map((dbMsg: DatabaseMessage) => ({
          id: dbMsg.id,
          role: dbMsg.role,
          content: dbMsg.content,
          citations: dbMsg.citations || [],
          timestamp: new Date(dbMsg.created_at)
        }));

        setMessages(convertedMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load conversation messages');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  return { messages, loading, error, setMessages };
};
