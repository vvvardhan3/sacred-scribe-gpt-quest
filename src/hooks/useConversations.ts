
import { useState, useEffect } from 'react';

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

  // Load conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chat-conversations');
    if (saved) {
      const parsed = JSON.parse(saved);
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp)
      }));
      setConversations(conversationsWithDates);
    }
  }, []);

  // Save conversations to localStorage
  const saveConversations = (convs: Conversation[]) => {
    localStorage.setItem('chat-conversations', JSON.stringify(convs));
    setConversations(convs);
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };
    const updated = [newConv, ...conversations];
    saveConversations(updated);
    setActiveConversationId(newConv.id);
    return newConv.id;
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    const updated = conversations.map(conv => 
      conv.id === id ? { ...conv, ...updates, timestamp: new Date() } : conv
    );
    saveConversations(updated);
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter(conv => conv.id !== id);
    saveConversations(updated);
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const renameConversation = (id: string, newTitle: string) => {
    updateConversation(id, { title: newTitle });
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
    getActiveConversation
  };
};
