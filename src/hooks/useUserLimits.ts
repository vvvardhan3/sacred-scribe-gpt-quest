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

// Define subscription limits based on plan_id from database
const SUBSCRIPTION_LIMITS = {
  free: {
    maxDailyMessages: 10,
    maxQuizzes: 1,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads'],
    subscriptionTier: 'Free Trial'
  },
  devotee: {
    maxDailyMessages: 200,
    maxQuizzes: 5,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads', 'Mahabharata', 'Bhagavad Gita', 'Ramayana'],
    subscriptionTier: 'Devotee Plan'
  },
  guru: {
    maxDailyMessages: Infinity,
    maxQuizzes: Infinity,
    allowedCategories: ['Vedas', 'Puranas', 'Upanishads', 'Mahabharata', 'Bhagavad Gita', 'Ramayana'],
    subscriptionTier: 'Guru Plan'
  }
};

export const useUserLimits = () => {
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Get current subscription limits based on user's plan_id from database
  const getCurrentLimits = (): SubscriptionLimits => {
    // Check if user has active subscription and plan_id
    if (subscription?.subscribed && subscription?.plan_id) {
      const planKey = subscription.plan_id as keyof typeof SUBSCRIPTION_LIMITS;
      return SUBSCRIPTION_LIMITS[planKey] || SUBSCRIPTION_LIMITS.free;
    }
    
    // Default to free plan
    return SUBSCRIPTION_LIMITS.free;
  };

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
        setUsage(null);
      } else {
        setUsage(data);
      }
    } catch (error) {
      setUsage(null);
    } finally {
      setLoading(false);
    }
  };

  const canSendMessage = (): boolean => {
    if (!usage) return false;
    const limits = getCurrentLimits();
    return usage.messages_sent_today < limits.maxDailyMessages;
  };

  const canCreateQuiz = (): boolean => {
    if (!usage) return false;
    const limits = getCurrentLimits();
    return usage.quizzes_created_total < limits.maxQuizzes;
  };

  const isCategoryAllowed = (category: string): boolean => {
    const limits = getCurrentLimits();
    return limits.allowedCategories.includes(category);
  };

  const incrementMessageCount = async () => {
    if (!user) return;

    try {
      await supabase.functions.invoke('increment-message-count', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      fetchUsage();
    } catch (error) {
      // Handle error silently
    }
  };

  const incrementQuizCount = async () => {
    if (!user) return;

    try {
      await supabase.functions.invoke('increment-quiz-count', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      fetchUsage();
    } catch (error) {
      // Handle error silently
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
