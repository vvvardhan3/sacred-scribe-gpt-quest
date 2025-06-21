
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
        console.log('Loading conversations for user:', user.id);
        
        // Check if migration is needed
        const hasMigrated = await migrationUtils.hasMigrated();
        if (!hasMigrated) {
          console.log('Running migration...');
          await migrationUtils.migrateToDatabase();
        }

        // Load conversations from database
        const dbConversations = await conversationDb.getConversations();
        console.log('Loaded conversations from DB:', dbConversations);
        
        // Convert to local format with basic info only (messages loaded separately)
        const convertedConversations = await Promise.all(
          dbConversations.map(async (dbConv: DatabaseConversation) => {
            // Get message count for preview
            try {
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
            } catch (error) {
              console.error('Error loading messages for conversation:', dbConv.id, error);
              return {
                id: dbConv.id,
                title: dbConv.title,
                lastMessage: 'Error loading messages',
                timestamp: new Date(dbConv.updated_at),
                messages: []
              };
            }
          })
        );

        console.log('Converted conversations:', convertedConversations);
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
    if (!user) {
      console.error('No user authenticated for creating conversation');
      return '';
    }

    try {
      console.log('Creating new conversation...');
      const dbConversation = await conversationDb.createConversation();
      console.log('Created conversation:', dbConversation);
      
      const newConv: Conversation = {
        id: dbConversation.id,
        title: dbConversation.title,
        lastMessage: '',
        timestamp: new Date(dbConversation.created_at),
        messages: []
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(dbConversation.id);
      console.log('New conversation added to state:', newConv);
      return dbConversation.id;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      return '';
    }
  };

  const updateConversation = async (id: string, updates: Partial<Conversation>) => {
    try {
      console.log('Updating conversation:', id, updates);
      
      // Update in database
      if (updates.title) {
        await conversationDb.updateConversation(id, { title: updates.title });
        console.log('Updated conversation title in DB');
      }

      if (updates.messages) {
        await conversationDb.saveMessages(id, updates.messages);
        console.log('Saved messages to DB');
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
            console.log('Updated conversation in state:', updatedConv);
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
      console.log('Deleting conversation:', id);
      await conversationDb.deleteConversation(id);
      
      setConversations(prev => prev.filter(conv => conv.id !== id));
      
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
      
      console.log('Conversation deleted successfully');
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const renameConversation = async (id: string, newTitle: string) => {
    console.log('Renaming conversation:', id, 'to:', newTitle);
    await updateConversation(id, { title: newTitle });
  };

  const getActiveConversation = () => {
    const activeConv = conversations.find(conv => conv.id === activeConversationId) || null;
    console.log('Getting active conversation:', activeConv);
    return activeConv;
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
