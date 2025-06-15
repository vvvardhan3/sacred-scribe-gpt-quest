
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Star, Infinity, Check, CreditCard, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { usePayments } from '@/hooks/usePayments';
import RazorpayPayment from '@/components/RazorpayPayment';
import { Skeleton } from '@/components/ui/skeleton';

const Billing = () => {
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { payments, loading: paymentsLoading } = usePayments();

  const plans = [
    {
      id: 'devotee',
      name: 'Devotee Plan',
      price: 999,
      originalPrice: 1499,
      period: 'month',
      description: 'Comprehensive access for dedicated learners of Hindu philosophy',
      features: [
        '200 AI chat messages daily',
        'Create up to 5 quizzes',
        'Complete scripture library access',
        'Advanced AI explanations',
        'Personalized study plans'
      ],
      limitations: [],
      popular: true,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'guru',
      name: 'Guru Plan',
      price: 2999,
      originalPrice: 3999,
      period: 'month',
      description: 'Ultimate package for teachers, scholars & spiritual guides',
      features: [
        'Unlimited AI conversations',
        'Unlimited quiz creation',
        'Complete scripture collection',
        'Advanced AI philosophical insights',
        'White-glove support & API access'
      ],
      limitations: [],
      popular: false,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const getCurrentPlan = () => {
    if (subscriptionLoading) return null;
    
    // Only return a paid plan if the user is actually subscribed
    if (!subscription?.subscribed || !subscription?.plan_id) {
      return { id: 'free', name: 'Free Trial', price: 0, period: 'forever', description: 'Perfect for exploring Hindu scriptures and getting started' };
    }
    
    return plans.find(p => p.id === subscription.plan_id) || { id: 'free', name: 'Free Trial', price: 0, period: 'forever', description: 'Perfect for exploring Hindu scriptures and getting started' };
  };

  const currentPlan = getCurrentPlan();

  // Check if user has an active subscription for a specific plan
  const isCurrentPlan = (planId: string) => {
    return subscription?.subscribed && subscription?.plan_id === planId;
  };

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
        <Navigation />
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-32 w-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <Navigation />
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Billing & Subscription</h1>
            <p className="text-lg text-gray-600">Manage your subscription and enhance your spiritual learning experience</p>
          </div>

          {/* Current Plan */}
          <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                <Badge className={subscription?.subscribed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  {subscription?.subscribed ? "Active" : "Free"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentPlan?.name}</h3>
                  <p className="text-gray-600">{currentPlan?.description}</p>
                  {subscription?.subscription_end && subscription?.subscribed && (
                    <p className="text-sm text-gray-500 mt-2">
                      Valid until: {new Date(subscription.subscription_end).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">₹{currentPlan?.price || 0}</div>
                  <div className="text-gray-600">per {currentPlan?.period}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Spiritual Learning Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative bg-white border-2 ${plan.popular ? 'border-orange-500 shadow-lg' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                      {plan.name === 'Devotee Plan' && <Crown className="w-8 h-8 text-white" />}
                      {plan.name === 'Guru Plan' && <Infinity className="w-8 h-8 text-white" />}
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-orange-600">
                        ₹{plan.price}
                        <span className="text-sm text-gray-600 font-normal">/{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="text-lg text-gray-400 line-through">
                          ₹{plan.originalPrice}/{plan.period}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="font-semibold text-green-700 mb-3 flex items-center justify-center">
                          <Check className="w-4 h-4 mr-2" />
                          What's Included:
                        </h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center justify-center text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      {isCurrentPlan(plan.id) ? (
                        <Button 
                          className="w-full bg-gray-200 text-gray-700"
                          disabled
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <RazorpayPayment
                          planId={plan.id}
                          planName={plan.name}
                          price={plan.price}
                          buttonText={`Choose ${plan.name}`}
                          className="w-full"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No payment history found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <div className="font-semibold text-gray-900">{payment.plan_name}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(payment.created_at).toLocaleDateString('en-IN')} • Payment ID: {payment.razorpay_payment_id}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-gray-900">₹{payment.amount / 100}</span>
                        <Badge className="bg-green-100 text-green-800">{payment.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-0 text-white">
            <CardHeader>
              <CardTitle className="text-center text-white">Need Help with Billing?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/90 mb-4">
                Our support team is here to assist you with any billing questions or concerns about your spiritual learning journey.
              </p>
              <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;
