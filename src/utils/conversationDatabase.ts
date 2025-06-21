
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[] | null;
  created_at: string;
}

export const conversationDb = {
  async getConversations(): Promise<DatabaseConversation[]> {
    console.log('Fetching conversations from database');
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    console.log('Fetched conversations:', data);
    return data || [];
  },

  async createConversation(title: string = 'New Conversation'): Promise<DatabaseConversation> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

    console.log('Creating new conversation with title:', title);
    const { data, error } = await supabase
      .from('conversations')
      .insert({ 
        title, 
        user_id: userData.user.id 
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }

    console.log('Created conversation:', data);
    return data;
  },

  async updateConversation(id: string, updates: { title?: string }): Promise<void> {
    console.log('Updating conversation:', id, updates);
    const { error } = await supabase
      .from('conversations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  async deleteConversation(id: string): Promise<void> {
    console.log('Deleting conversation:', id);
    
    // The CASCADE will automatically delete messages, so we just delete the conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  async getMessages(conversationId: string): Promise<DatabaseMessage[]> {
    console.log('Fetching messages for conversation:', conversationId);
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    console.log('Fetched messages from database:', data);
    
    return (data || []).map(msg => ({
      ...msg,
      role: msg.role as 'user' | 'assistant',
      citations: msg.citations as string[] | null
    }));
  },

  async saveMessage(conversationId: string, message: any): Promise<void> {
    console.log('Saving single message to database:', conversationId, message);
    
    const messageToSave = {
      id: message.id,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      citations: message.citations || null,
      created_at: message.timestamp?.toISOString() || new Date().toISOString()
    };

    console.log('Saving message:', messageToSave);

    const { error } = await supabase
      .from('messages')
      .insert(messageToSave);

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    console.log('Message saved successfully');

    // Update conversation timestamp
    await this.updateConversation(conversationId, {}).catch(err => {
      console.warn('Failed to update conversation timestamp:', err);
    });
  },

  async saveMessages(conversationId: string, messages: any[]): Promise<void> {
    console.log('Saving messages to database:', conversationId, messages);
    
    if (messages.length === 0) return;

    // Get existing messages to avoid duplicates
    const existingMessages = await this.getMessages(conversationId);
    const existingIds = new Set(existingMessages.map(msg => msg.id));

    // Filter out messages that already exist
    const newMessages = messages.filter(msg => !existingIds.has(msg.id));

    if (newMessages.length === 0) {
      console.log('No new messages to save');
      return;
    }

    // Prepare messages for insertion
    const messagesToSave = newMessages.map(msg => ({
      id: msg.id,
      conversation_id: conversationId,
      role: msg.role,
      content: msg.content,
      citations: msg.citations || null,
      created_at: msg.timestamp?.toISOString() || new Date().toISOString()
    }));

    console.log('Inserting new messages:', messagesToSave);

    const { error } = await supabase
      .from('messages')
      .insert(messagesToSave);

    if (error) {
      console.error('Error saving messages:', error);
      throw error;
    }

    console.log('Messages saved successfully');

    // Update conversation timestamp
    await this.updateConversation(conversationId, {}).catch(err => {
      console.warn('Failed to update conversation timestamp:', err);
    });
  }
};
