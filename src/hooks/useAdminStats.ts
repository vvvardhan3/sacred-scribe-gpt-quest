
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  totalMessages: number;
  totalQuizzes: number;
  devoteeSubscribers: number;
  guruSubscribers: number;
  freeUsers: number;
  totalRevenue: number;
  recentPayments: any[];
  contactSubmissions: any[];
  feedbackSubmissions: any[];
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMessages: 0,
    totalQuizzes: 0,
    devoteeSubscribers: 0,
    guruSubscribers: 0,
    freeUsers: 0,
    totalRevenue: 0,
    recentPayments: [],
    contactSubmissions: [],
    feedbackSubmissions: []
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

      // Get total quizzes count
      const { count: quizzesCount } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true });

      // Get subscriber counts
      const { data: subscriberCounts } = await supabase
        .rpc('get_subscriber_counts');

      // Calculate free users (total users minus subscribers)
      const totalSubscribers = (subscriberCounts?.[0]?.devotee_count || 0) + (subscriberCounts?.[0]?.guru_count || 0);
      const freeUsers = (usersCount || 0) - totalSubscribers;

      // Get recent payments for revenue calculation
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'captured')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate total revenue
      const totalRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      // Get contact form submissions
      const { data: contactSubmissions } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Get feedback submissions
      const { data: feedbackSubmissions } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setStats({
        totalUsers: usersCount || 0,
        totalMessages: messagesCount || 0,
        totalQuizzes: quizzesCount || 0,
        devoteeSubscribers: subscriberCounts?.[0]?.devotee_count || 0,
        guruSubscribers: subscriberCounts?.[0]?.guru_count || 0,
        freeUsers: Math.max(freeUsers, 0),
        totalRevenue: totalRevenue / 100, // Convert from paise to rupees
        recentPayments: payments || [],
        contactSubmissions: contactSubmissions || [],
        feedbackSubmissions: feedbackSubmissions || []
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
