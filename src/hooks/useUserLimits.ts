
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from './useSubscription';
import { supabase } from '@/integrations/supabase/client';

export interface UserUsage {
  messages_sent_today: number;
  quizzes_created_total: number;
  messages_reset_date: string;
}

export interface SubscriptionLimits {
  maxDailyMessages: number;
  maxQuizzes: number;
  allowedCategories: string[];
  subscriptionTier: string;
}

// Define subscription limits based on tier
const SUBSCRIPTION_LIMITS = {
  free: {
    maxDailyMessages: 10,
    maxQuizzes: 1,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads'],
    subscriptionTier: 'Free Trial'
  },
  'Devotee Plan': {
    maxDailyMessages: 200,
    maxQuizzes: 5,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads', 'Mahabharata', 'Bhagavad Gita', 'Ramayana'],
    subscriptionTier: 'Devotee'
  },
  'Guru Plan': {
    maxDailyMessages: Infinity,
    maxQuizzes: Infinity,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads', 'Mahabharata', 'Bhagavad Gita', 'Ramayana'],
    subscriptionTier: 'Guru'
  }
};

export const useUserLimits = () => {
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Get current subscription limits based on user's subscription tier
  const getCurrentLimits = (): SubscriptionLimits => {
    const tier = subscription?.subscribed ? subscription.subscription_tier : 'free';
    return SUBSCRIPTION_LIMITS[tier as keyof typeof SUBSCRIPTION_LIMITS] || SUBSCRIPTION_LIMITS.free;
  };

  // Fetch user usage from database
  const fetchUsage = async () => {
    if (!user) {
      setUsage(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('get-user-usage', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching usage:', error);
        setUsage(null);
      } else {
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
      setUsage(null);
    } finally {
      setLoading(false);
    }
  };

  // Check if user can send a message
  const canSendMessage = (): boolean => {
    if (!usage) return false;
    const limits = getCurrentLimits();
    return usage.messages_sent_today < limits.maxDailyMessages;
  };

  // Check if user can create a quiz
  const canCreateQuiz = (): boolean => {
    if (!usage) return false;
    const limits = getCurrentLimits();
    return usage.quizzes_created_total < limits.maxQuizzes;
  };

  // Check if category is allowed for user's subscription
  const isCategoryAllowed = (category: string): boolean => {
    const limits = getCurrentLimits();
    return limits.allowedCategories.includes(category);
  };

  // Increment message count
  const incrementMessageCount = async () => {
    if (!user) return;

    try {
      await supabase.functions.invoke('increment-message-count', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      // Refresh usage after incrementing
      fetchUsage();
    } catch (error) {
      console.error('Error incrementing message count:', error);
    }
  };

  // Increment quiz count
  const incrementQuizCount = async () => {
    if (!user) return;

    try {
      await supabase.functions.invoke('increment-quiz-count', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      // Refresh usage after incrementing
      fetchUsage();
    } catch (error) {
      console.error('Error incrementing quiz count:', error);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  return {
    usage,
    loading,
    limits: getCurrentLimits(),
    canSendMessage,
    canCreateQuiz,
    isCategoryAllowed,
    incrementMessageCount,
    incrementQuizCount,
    refetch: fetchUsage
  };
};
