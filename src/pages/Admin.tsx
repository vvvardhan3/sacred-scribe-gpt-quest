
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  Crown, 
  Zap, 
  IndianRupee,
  RefreshCw,
  ArrowLeft,
  TrendingUp,
  BookOpen,
  UserCheck,
  Mail,
  MessageCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdminStats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Admin = () => {
  const { stats, loading, refetch } = useAdminStats();
  const [showContactSubmissions, setShowContactSubmissions] = useState(false);
  const [showFeedbackSubmissions, setShowFeedbackSubmissions] = useState(false);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages.toLocaleString(),
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      change: '+18%'
    },
    {
      title: 'Total Quizzes',
      value: stats.totalQuizzes.toLocaleString(),
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      change: '+22%'
    },
    {
      title: 'Devotee Subscribers',
      value: stats.devoteeSubscribers.toLocaleString(),
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      change: '+8%'
    },
    {
      title: 'Guru Subscribers',
      value: stats.guruSubscribers.toLocaleString(),
      icon: <Crown className="w-6 h-6" />,
      color: 'from-amber-500 to-yellow-600',
      change: '+15%'
    },
    {
      title: 'Free Users',
      value: stats.freeUsers.toLocaleString(),
      icon: <UserCheck className="w-6 h-6" />,
      color: 'from-gray-500 to-gray-600',
      change: '+5%'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <IndianRupee className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      change: '+25%'
    },
    {
      title: 'Contact Messages',
      value: stats.contactSubmissions.length.toString(),
      icon: <Mail className="w-6 h-6" />,
      color: 'from-rose-500 to-pink-600',
      change: '+10%'
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'bug_report': return 'bg-red-100 text-red-800';
      case 'feature_request': return 'bg-blue-100 text-blue-800';
      case 'suggestion': return 'bg-green-100 text-green-800';
      case 'feedback': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navigation />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-gray-600">Monitor system performance and user engagement</p>
              </div>
            </div>
            <Button 
              onClick={() => refetch()} 
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} text-white`}>
                    {card.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  <p className="text-xs text-green-600 font-medium">
                    {card.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Submissions Section */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  Contact Form Submissions ({stats.contactSubmissions.length})
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setShowContactSubmissions(!showContactSubmissions)}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  {showContactSubmissions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            {showContactSubmissions && (
              <CardContent>
                {stats.contactSubmissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.contactSubmissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.name}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{submission.subject}</TableCell>
                            <TableCell className="max-w-xs truncate" title={submission.message}>
                              {submission.message}
                            </TableCell>
                            <TableCell>
                              {new Date(submission.created_at).toLocaleDateString('en-IN')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No contact submissions found</p>
                )}
              </CardContent>
            )}
          </Card>

          {/* Feedback Submissions Section */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                  Feedback Submissions ({stats.feedbackSubmissions.length})
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setShowFeedbackSubmissions(!showFeedbackSubmissions)}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  {showFeedbackSubmissions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            {showFeedbackSubmissions && (
              <CardContent>
                {stats.feedbackSubmissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Page URL</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.feedbackSubmissions.map((feedback) => (
                          <TableRow key={feedback.id}>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(feedback.type)}`}>
                                {feedback.type?.replace('_', ' ')}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{feedback.title}</TableCell>
                            <TableCell className="max-w-xs truncate" title={feedback.description}>
                              {feedback.description}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(feedback.status)}`}>
                                {feedback.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {feedback.page_url || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {new Date(feedback.created_at).toLocaleDateString('en-IN')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No feedback submissions found</p>
                )}
              </CardContent>
            )}
          </Card>

          {/* Recent Payments Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-orange-600" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="text-sm text-gray-600">
                            {payment.razorpay_payment_id?.slice(-8) || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {payment.plan_name}
                            </span>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₹{(payment.amount / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent payments found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
