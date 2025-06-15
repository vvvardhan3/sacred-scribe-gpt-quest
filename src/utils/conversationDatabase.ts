
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
  // Fetch all conversations for the current user
  async getConversations(): Promise<DatabaseConversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new conversation
  async createConversation(title: string = 'New Conversation'): Promise<DatabaseConversation> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User not authenticated');
    }

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

  // Update conversation title and timestamp
  async updateConversation(id: string, updates: { title?: string }): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  // Delete a conversation and its messages
  async deleteConversation(id: string): Promise<void> {
    // First delete messages
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', id);

    if (messagesError) {
      console.error('Error deleting messages:', messagesError);
      throw messagesError;
    }

    // Then delete conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // Get messages for a conversation
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

    console.log('Retrieved messages from database:', data);
    
    return (data || []).map(msg => ({
      ...msg,
      role: msg.role as 'user' | 'assistant',
      citations: msg.citations as string[] | null
    }));
  },

  // Save a single message to the database
  async saveMessage(conversationId: string, message: any): Promise<void> {
    console.log('Saving single message to database:', conversationId, message);
    
    // Check if message already exists
    const { data: existingMessage } = await supabase
      .from('messages')
      .select('id')
      .eq('id', message.id)
      .single();

    if (existingMessage) {
      console.log('Message already exists, skipping insert');
      return;
    }

    const messageToInsert = {
      id: message.id,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      citations: message.citations || null,
      created_at: message.timestamp?.toISOString() || new Date().toISOString()
    };

    console.log('Inserting message:', messageToInsert);

    const { error } = await supabase
      .from('messages')
      .insert(messageToInsert);

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    console.log('Message saved successfully');

    // Update conversation timestamp
    await this.updateConversation(conversationId, {});
  },

  // Save messages for a conversation (replace all existing messages)
  async saveMessages(conversationId: string, messages: any[]): Promise<void> {
    console.log('Saving messages to database:', conversationId, messages);
    
    if (messages.length === 0) return;

    // Get existing messages
    const { data: existingMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('conversation_id', conversationId);

    const existingIds = existingMessages?.map(msg => msg.id) || [];
    const newMessages = messages.filter(msg => !existingIds.includes(msg.id));

    // Only insert new messages
    if (newMessages.length > 0) {
      const messagesToInsert = newMessages.map(msg => ({
        id: msg.id,
        conversation_id: conversationId,
        role: msg.role,
        content: msg.content,
        citations: msg.citations || null,
        created_at: msg.timestamp?.toISOString() || new Date().toISOString()
      }));

      console.log('Inserting new messages:', messagesToInsert);

      const { error: insertError } = await supabase
        .from('messages')
        .insert(messagesToInsert);

      if (insertError) {
        console.error('Error saving messages:', insertError);
        throw insertError;
      }

      console.log('Messages saved successfully');
    }

    // Update conversation timestamp
    await this.updateConversation(conversationId, {});
  }
};
