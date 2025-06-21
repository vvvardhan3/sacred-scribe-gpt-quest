
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalMessages: number;
  devoteeSubscribers: number;
  guruSubscribers: number;
  totalRevenue: number;
  recentPayments: any[];
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMessages: 0,
    devoteeSubscribers: 0,
    guruSubscribers: 0,
    totalRevenue: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Get subscriber counts
      const { data: subscriberCounts } = await supabase
        .rpc('get_subscriber_counts');

      // Get recent payments for revenue calculation
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'captured')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate total revenue
      const totalRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalMessages: messagesCount || 0,
        devoteeSubscribers: subscriberCounts?.[0]?.devotee_count || 0,
        guruSubscribers: subscriberCounts?.[0]?.guru_count || 0,
        totalRevenue: totalRevenue / 100, // Convert from paise to rupees
        recentPayments: payments || []
      });

    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
};
