
import React from 'react';
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
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdminStats';

const Admin = () => {
  const { stats, loading, refetch } = useAdminStats();

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
      color: 'from-purple-500 to-indigo-600',
      change: '+15%'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <IndianRupee className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      change: '+25%'
    },
    {
      title: 'Recent Payments',
      value: stats.recentPayments.length.toString(),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      change: '+5%'
    }
  ];

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
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => (
              <Card key={index} className="relative overflow-hidden">
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

          {/* Recent Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-orange-600" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Payment ID</th>
                        <th className="text-left py-2">Plan</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPayments.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="py-2 text-sm text-gray-600">
                            {payment.razorpay_payment_id?.slice(-8) || 'N/A'}
                          </td>
                          <td className="py-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {payment.plan_name}
                            </span>
                          </td>
                          <td className="py-2 font-semibold">
                            ₹{(payment.amount / 100).toFixed(2)}
                          </td>
                          <td className="py-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-2 text-sm text-gray-600">
                            {new Date(payment.created_at).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
