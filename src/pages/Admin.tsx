
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, MessageSquare, HelpCircle, Star, BarChart3, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalQuizzes: 0,
    totalFeedback: 0
  });
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch message count - using correct table name 'messages'
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Fetch quiz count - using correct table name 'progress'
      const { count: quizCount } = await supabase
        .from('progress')
        .select('*', { count: 'exact', head: true });

      // Fetch feedback count
      const { count: feedbackCount } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        totalMessages: messageCount || 0,
        totalQuizzes: quizCount || 0,
        totalFeedback: feedbackCount || 0
      });

      // Fetch users with profile data
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setUsers(usersData || []);

      // Fetch feedback with user profiles
      const { data: feedbackData } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles!feedback_user_id_fkey (
            display_name
          )
        `)
        .order('created_at', { ascending: false });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Monitor and manage your HinduGPT platform</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <Users className="h-6 w-6 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-blue-200 mt-1">Registered members</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Messages</CardTitle>
              <MessageSquare className="h-6 w-6 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-green-200 mt-1">Chat interactions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Quizzes</CardTitle>
              <HelpCircle className="h-6 w-6 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalQuizzes}</div>
              <p className="text-xs text-purple-200 mt-1">Quiz attempts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Total Feedback</CardTitle>
              <Star className="h-6 w-6 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalFeedback}</div>
              <p className="text-xs text-orange-200 mt-1">User submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm border border-orange-200">
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Users Management
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              User Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-orange-600" />
                  Recent Users
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Latest registered users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.display_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.display_name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{user.id}</p>
                          <p className="text-xs text-gray-400">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                        Active User
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-orange-600" />
                  User Feedback & Reports
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Recent feedback, bug reports, and feature requests from users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.slice(0, 10).map((item) => (
                    <div key={item.id} className="p-6 bg-white rounded-lg border border-orange-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {item.profiles?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.profiles?.display_name || 'Anonymous User'}
                            </p>
                            <p className="text-sm text-gray-500">{item.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={item.type === 'bug' ? 'destructive' : item.type === 'feature' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {item.type}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={item.status === 'open' ? 'secondary' : item.status === 'resolved' ? 'default' : 'outline'}
                          className="capitalize"
                        >
                          {item.status}
                        </Badge>
                        <Badge 
                          variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {item.priority} Priority
                        </Badge>
                      </div>
                    </div>
                  ))}
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
