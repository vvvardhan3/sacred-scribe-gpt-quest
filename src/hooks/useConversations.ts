
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { conversationDb, DatabaseConversation } from '@/utils/conversationDatabase';
import { migrationUtils } from '@/utils/migrationUtils';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: any[];
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load conversations from database when user is authenticated
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }

      try {
        // Check if migration is needed
        const hasMigrated = await migrationUtils.hasMigrated();
        if (!hasMigrated) {
          await migrationUtils.migrateToDatabase();
        }

        // Load conversations from database
        const dbConversations = await conversationDb.getConversations();
        
        // Convert to local format with basic info only (messages loaded separately)
        const convertedConversations = await Promise.all(
          dbConversations.map(async (dbConv: DatabaseConversation) => {
            // Get message count for preview
            const messages = await conversationDb.getMessages(dbConv.id);
            const userMessages = messages.filter(msg => msg.role === 'user');
            const lastUserMessage = userMessages[userMessages.length - 1];

            return {
              id: dbConv.id,
              title: dbConv.title,
              lastMessage: lastUserMessage ? lastUserMessage.content.slice(0, 100) : 'No messages yet',
              timestamp: new Date(dbConv.updated_at),
              messages: [] // Don't store messages here, load them when needed
            };
          })
        );

        setConversations(convertedConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  const createNewConversation = async () => {
    if (!user) return '';

    try {
      const dbConversation = await conversationDb.createConversation();
      
      const newConv: Conversation = {
        id: dbConversation.id,
        title: dbConversation.title,
        lastMessage: '',
        timestamp: new Date(dbConversation.created_at),
        messages: []
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(dbConversation.id);
      return dbConversation.id;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      return '';
    }
  };

  const updateConversation = async (id: string, updates: Partial<Conversation>) => {
    try {
      // Update in database
      if (updates.title) {
        await conversationDb.updateConversation(id, { title: updates.title });
      }

      if (updates.messages) {
        await conversationDb.saveMessages(id, updates.messages);
      }

      // Update local state
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === id) {
            const updatedConv = { ...conv, ...updates, timestamp: new Date() };
            // Update last message preview if messages were updated
            if (updates.messages && updates.messages.length > 0) {
              const userMessages = updates.messages.filter((msg: any) => msg.role === 'user');
              const lastUserMessage = userMessages[userMessages.length - 1];
              updatedConv.lastMessage = lastUserMessage ? lastUserMessage.content.slice(0, 100) : 'No messages yet';
            }
            return updatedConv;
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await conversationDb.deleteConversation(id);
      
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const renameConversation = async (id: string, newTitle: string) => {
    await updateConversation(id, { title: newTitle });
  };

  const getActiveConversation = () => {
    return conversations.find(conv => conv.id === activeConversationId) || null;
  };

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    updateConversation,
    deleteConversation,
    renameConversation,
    getActiveConversation,
    loading
  };
};
