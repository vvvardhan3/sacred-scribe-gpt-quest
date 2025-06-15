
import { supabase } from '@/integrations/supabase/client';
import { conversationDb } from './conversationDatabase';

export interface LocalStorageConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: any[];
}

export const migrationUtils = {
  // Check if migration has been completed for this user
  async hasMigrated(): Promise<boolean> {
    const migrationKey = `chat-migration-completed-${(await supabase.auth.getUser()).data.user?.id}`;
    return localStorage.getItem(migrationKey) === 'true';
  },

  // Mark migration as completed
  async markMigrationCompleted(): Promise<void> {
    const migrationKey = `chat-migration-completed-${(await supabase.auth.getUser()).data.user?.id}`;
    localStorage.setItem(migrationKey, 'true');
  },

  // Get conversations from local storage
  getLocalStorageConversations(): LocalStorageConversation[] {
    const saved = localStorage.getItem('chat-conversations');
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      return parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp)
      }));
    } catch (error) {
      console.error('Error parsing local storage conversations:', error);
      return [];
    }
  },

  // Migrate conversations from local storage to database
  async migrateToDatabase(): Promise<void> {
    console.log('Starting migration from local storage to database...');
    
    const localConversations = this.getLocalStorageConversations();
    if (localConversations.length === 0) {
      console.log('No local conversations to migrate');
      await this.markMigrationCompleted();
      return;
    }

    console.log(`Migrating ${localConversations.length} conversations...`);

    for (const localConv of localConversations) {
      try {
        // Create conversation in database
        const dbConversation = await conversationDb.createConversation(localConv.title);
        
        // Save messages if any exist
        if (localConv.messages && localConv.messages.length > 0) {
          await conversationDb.saveMessages(dbConversation.id, localConv.messages);
        }

        console.log(`Migrated conversation: ${localConv.title}`);
      } catch (error) {
        console.error(`Error migrating conversation ${localConv.title}:`, error);
      }
    }

    // Mark migration as completed
    await this.markMigrationCompleted();
    
    // Optionally clear local storage conversations after successful migration
    // localStorage.removeItem('chat-conversations');
    
    console.log('Migration completed successfully');
  }
};
