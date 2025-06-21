
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
      console.log('Fetching admin stats...');

      // Check if admin is authenticated via localStorage
      const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      
      if (!isAdminAuthenticated) {
        console.error('Admin not authenticated');
        return;
      }

      // Get total messages count using RPC function
      const { data: messageCountData, error: messageError } = await supabase
        .rpc('get_total_message_count');
      
      console.log('Message count:', messageCountData, 'Error:', messageError);

      // Get total quizzes count
      const { count: quizzesCount, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true });

      console.log('Quizzes count:', quizzesCount, 'Error:', quizzesError);

      // Get subscriber counts using RPC function
      const { data: subscriberCounts, error: subscriberError } = await supabase
        .rpc('get_subscriber_counts');

      console.log('Subscriber counts:', subscriberCounts, 'Error:', subscriberError);

      // Use the new admin stats function to get data safely
      const { data: adminStatsData, error: adminStatsError } = await supabase
        .rpc('get_admin_stats');

      console.log('Admin stats data:', adminStatsData, 'Error:', adminStatsError);

      // Calculate free users (total users minus subscribers)
      const totalSubscribers = (subscriberCounts?.[0]?.devotee_count || 0) + (subscriberCounts?.[0]?.guru_count || 0);
      const totalUsers = adminStatsData?.total_users || 0;
      const freeUsers = Math.max(totalUsers - totalSubscribers, 0);

      // Get recent payments for revenue calculation
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'captured')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('Payments:', payments, 'Error:', paymentsError);

      // Calculate total revenue
      const totalRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      // Get contact form submissions - try direct query first, fallback to admin function if needed
      let contactSubmissions = [];
      try {
        const { data: contactData, error: contactError } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (contactError) {
          console.log('Contact submissions error:', contactError);
          // If direct query fails, we'll show empty array for now
          contactSubmissions = [];
        } else {
          contactSubmissions = contactData || [];
        }
      } catch (error) {
        console.log('Contact submissions fetch error:', error);
        contactSubmissions = [];
      }

      console.log('Contact submissions:', contactSubmissions);

      // Get feedback submissions - try direct query first
      let feedbackSubmissions = [];
      try {
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (feedbackError) {
          console.log('Feedback submissions error:', feedbackError);
          feedbackSubmissions = [];
        } else {
          feedbackSubmissions = feedbackData || [];
        }
      } catch (error) {
        console.log('Feedback submissions fetch error:', error);
        feedbackSubmissions = [];
      }

      console.log('Feedback submissions:', feedbackSubmissions);

      setStats({
        totalUsers: totalUsers,
        totalMessages: messageCountData || 0,
        totalQuizzes: quizzesCount || 0,
        devoteeSubscribers: subscriberCounts?.[0]?.devotee_count || 0,
        guruSubscribers: subscriberCounts?.[0]?.guru_count || 0,
        freeUsers: Math.max(freeUsers, 0),
        totalRevenue: totalRevenue / 100, // Convert from paise to rupees
        recentPayments: payments || [],
        contactSubmissions: contactSubmissions,
        feedbackSubmissions: feedbackSubmissions
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
