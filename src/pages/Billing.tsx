
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { usePayments } from '@/hooks/usePayments';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrentPlanCard } from '@/components/billing/CurrentPlanCard';
import { PlanCard } from '@/components/billing/PlanCard';
import { PaymentHistoryCard } from '@/components/billing/PaymentHistoryCard';
import { SupportCard } from '@/components/billing/SupportCard';

const Billing = () => {
  const { subscription, loading: subscriptionLoading, refetch } = useSubscription();
  const { payments, loading: paymentsLoading } = usePayments();

  // Refresh subscription data when component mounts or when returning from payment
  useEffect(() => {
    refetch();
  }, [refetch]);

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

  const handlePaymentSuccess = () => {
    // Refresh subscription and payment data after successful payment
    // console.log('Payment successful, refreshing data...');
    refetch();
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

          <CurrentPlanCard 
            subscription={subscription}
            currentPlan={currentPlan}
            subscriptionLoading={subscriptionLoading}
          />

          {/* Available Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Spiritual Learning Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrentPlan={isCurrentPlan(plan.id)}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              ))}
            </div>
          </div>

          <PaymentHistoryCard 
            payments={payments}
            paymentsLoading={paymentsLoading}
          />

          <SupportCard />
        </div>
      </div>
    </div>
  );
};

export default Billing;
