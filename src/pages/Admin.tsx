
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Users, MessageSquare, HelpCircle, Star, Shield, LogOut, Trash2, StickyNote, Crown, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
  totalUsers: number;
  totalMessages: number;
  totalQuizzes: number;
  totalFeedback: number;
  devoteeCount: number;
  guruCount: number;
}

interface User {
  id: string;
  display_name: string;
  email: string;
  created_at: string;
}

interface FeedbackItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  page_url?: string;
  created_at: string;
  profiles?: {
    display_name: string;
  };
  admin_notes?: string;
}

const Admin = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMessages: 0,
    totalQuizzes: 0,
    totalFeedback: 0,
    devoteeCount: 0,
    guruCount: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
    setupRealtimeSubscriptions();
    
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  const setupRealtimeSubscriptions = () => {
    // Subscribe to profiles changes
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchAdminData()
      )
      .subscribe();

    // Subscribe to messages changes
    const messagesChannel = supabase
      .channel('admin-messages-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        () => fetchAdminData()
      )
      .subscribe();

    // Subscribe to feedback changes
    const feedbackChannel = supabase
      .channel('admin-feedback-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'feedback' },
        () => fetchAdminData()
      )
      .subscribe();

    // Subscribe to subscribers changes
    const subscribersChannel = supabase
      .channel('admin-subscribers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'subscribers' },
        () => fetchAdminData()
      )
      .subscribe();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin-login');
  };

  const fetchAdminData = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total message count using the function
      const { data: messageCountData } = await supabase.rpc('get_total_message_count');
      const totalMessages = messageCountData || 0;

      // Fetch quiz count
      const { count: quizCount } = await supabase
        .from('progress')
        .select('*', { count: 'exact', head: true });

      // Fetch feedback count
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      // Fetch subscriber counts by plan
      const { data: subscriberCounts } = await supabase.rpc('get_subscriber_counts');
      const { devotee_count = 0, guru_count = 0 } = subscriberCounts?.[0] || {};

      setStats({
        totalUsers: userCount || 0,
        totalMessages,
        totalQuizzes: quizCount || 0,
        totalFeedback: feedbackCount || 0,
        devoteeCount: Number(devotee_count),
        guruCount: Number(guru_count)
      });

      // Fetch users with profile data
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, display_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      setUsers(usersData || []);

      // Fetch feedback with user profiles
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles (
            display_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      setFeedback(feedbackData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback deleted successfully",
      });
      
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete feedback",
        variant: "destructive",
      });
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', feedbackId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback status updated",
      });
      
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update feedback",
        variant: "destructive",
      });
    }
  };

  const addAdminNote = async () => {
    if (!selectedFeedback || !adminNote.trim()) return;

    try {
      const { error } = await supabase
        .from('feedback')
        .update({ 
          admin_notes: adminNote,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedFeedback.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin note added successfully",
      });
      
      setSelectedFeedback(null);
      setAdminNote('');
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add note",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">HinduGPT Admin</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devotee Plan</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.devoteeCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guru Plan</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.guruCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="feedback">Feedback & Support</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.display_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold">{user.display_name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Feedback & Support</CardTitle>
                <CardDescription>Bug reports, suggestions, and feature requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No feedback submissions yet
                    </div>
                  ) : (
                    feedback.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {item.profiles?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {item.profiles?.display_name || 'Anonymous User'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={item.type === 'bug_report' ? 'destructive' : 
                                      item.type === 'feature_request' ? 'default' : 'secondary'}
                            >
                              {item.type}
                            </Badge>
                            <Badge variant="outline">
                              {item.priority}
                            </Badge>
                            <Badge variant={item.status === 'open' ? 'secondary' : 'default'}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-700">{item.description}</p>
                          {item.admin_notes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-200">
                              <p className="text-sm text-blue-800">
                                <strong>Admin Note:</strong> {item.admin_notes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-4">
                            {item.page_url && (
                              <span className="text-gray-500">Page: {item.page_url}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedFeedback(item);
                                    setAdminNote(item.admin_notes || '');
                                  }}
                                >
                                  <StickyNote className="w-3 h-3 mr-1" />
                                  Note
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Admin Note</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea
                                    placeholder="Add your admin note here..."
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                  />
                                  <Button onClick={addAdminNote}>
                                    Save Note
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateFeedbackStatus(item.id, 
                                item.status === 'open' ? 'resolved' : 'open'
                              )}
                            >
                              {item.status === 'open' ? 'Resolve' : 'Reopen'}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteFeedback(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
