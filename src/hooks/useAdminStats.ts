
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

// Type for the admin stats response
interface AdminStatsResponse {
  total_users?: number;
  contact_submissions?: number;
  feedback_submissions?: number;
  error?: string;
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

      // Get total quizzes count - try direct count first, then fallback to select all
      const { count: quizzesCount, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true });

      console.log('Quizzes count:', quizzesCount, 'Error:', quizzesError);

      // If direct count fails, try getting all quiz records
      let finalQuizzesCount = quizzesCount || 0;
      if (quizzesError || quizzesCount === null) {
        console.log('Trying alternative quiz count method...');
        const { data: quizData, error: altQuizError } = await supabase
          .from('quizzes')
          .select('id');
        
        console.log('Alternative quiz data:', quizData, 'Alt error:', altQuizError);
        
        if (!altQuizError && quizData) {
          finalQuizzesCount = quizData.length;
          console.log('Alternative quiz count:', finalQuizzesCount);
        }
      }

      // Get subscriber counts using RPC function
      const { data: subscriberCounts, error: subscriberError } = await supabase
        .rpc('get_subscriber_counts');

      console.log('Subscriber counts:', subscriberCounts, 'Error:', subscriberError);

      // Use the admin stats function to get data safely
      const { data: adminStatsData, error: adminStatsError } = await supabase
        .rpc('get_admin_stats');

      console.log('Admin stats data:', adminStatsData, 'Error:', adminStatsError);

      // Parse the admin stats response with proper type checking
      let totalUsers = 0;
      if (adminStatsData && typeof adminStatsData === 'object' && adminStatsData !== null) {
        if (typeof adminStatsData === 'string') {
          try {
            const parsed = JSON.parse(adminStatsData);
            totalUsers = parsed.total_users || 0;
          } catch (e) {
            console.error('Failed to parse admin stats:', e);
          }
        } else {
          // adminStatsData is already an object
          totalUsers = (adminStatsData as any).total_users || 0;
        }
      }

      console.log('Parsed total users:', totalUsers);

      // Calculate free users (total users minus subscribers)
      const totalSubscribers = (subscriberCounts?.[0]?.devotee_count || 0) + (subscriberCounts?.[0]?.guru_count || 0);
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

      // Get contact form submissions
      const { data: contactData, error: contactError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('Contact submissions:', contactData, 'Error:', contactError);

      // Get feedback submissions using the security definer function approach
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('Feedback submissions:', feedbackData, 'Error:', feedbackError);

      setStats({
        totalUsers: totalUsers,
        totalMessages: messageCountData || 0,
        totalQuizzes: finalQuizzesCount,
        devoteeSubscribers: subscriberCounts?.[0]?.devotee_count || 0,
        guruSubscribers: subscriberCounts?.[0]?.guru_count || 0,
        freeUsers: Math.max(freeUsers, 0),
        totalRevenue: totalRevenue / 100, // Convert from paise to rupees
        recentPayments: payments || [],
        contactSubmissions: contactData || [],
        feedbackSubmissions: feedbackData || []
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
