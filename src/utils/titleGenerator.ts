
import { supabase } from '@/integrations/supabase/client';

export const generateTitle = async (message: string): Promise<string> => {
  try {
    console.log('Generating AI title for:', message);
    const { data, error } = await supabase.functions.invoke('generate-chat-title', {
      body: { message }
    });

    if (error) {
      console.error('Title generation error:', error);
      throw error;
    }

    console.log('Generated title:', data.title);
    return data.title;
  } catch (error) {
    console.error('Failed to generate AI title, using fallback:', error);
    // Fallback to simple truncation
    return message.slice(0, 30) + (message.length > 30 ? '...' : '');
  }
};
