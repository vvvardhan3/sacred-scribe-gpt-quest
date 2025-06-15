
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  plan_id: string | null;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('razorpay-get-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching subscription:', error);
        setSubscription({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          plan_id: null
        });
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        plan_id: null
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const createSubscription = async (planId: string) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.functions.invoke('razorpay-create-subscription', {
      body: { planId, userId: user.id },
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) throw new Error(error.message || 'Failed to create subscription');
    return data;
  };

  const verifyPayment = async (paymentData: any) => {
    const { data, error } = await supabase.functions.invoke('razorpay-verify-payment', {
      body: paymentData,
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) throw new Error(error.message || 'Failed to verify payment');
    
    // Refresh subscription data after successful payment
    await fetchSubscription();
    
    return data;
  };

  return {
    subscription,
    loading,
    createSubscription,
    verifyPayment,
    refetch: fetchSubscription
  };
};
