
import React from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Star, Infinity, Check, CreditCard, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Billing = () => {
  const currentPlan = {
    name: 'Free Plan',
    price: 0,
    features: ['Basic Quiz Access', 'Limited AI Chat', 'Progress Tracking']
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started with your spiritual journey',
      features: [
        'Access to basic quizzes',
        '10 AI chat messages per day',
        'Basic progress tracking',
        'Daily wisdom quotes'
      ],
      popular: false,
      color: 'from-gray-400 to-gray-600'
    },
    {
      name: 'Devotee',
      price: 9.99,
      period: 'month',
      description: 'Enhanced learning for dedicated spiritual seekers',
      features: [
        'Unlimited quiz access',
        'Unlimited AI chat with HinduGPT',
        'Advanced progress analytics',
        'Personalized learning paths',
        'Offline scripture downloads',
        'Priority support'
      ],
      popular: true,
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'Guru',
      price: 29.99,
      period: 'month',
      description: 'Complete spiritual learning experience',
      features: [
        'Everything in Devotee plan',
        'Advanced AI insights and analysis',
        'Custom quiz creation',
        'Exclusive premium content',
        'One-on-one guidance sessions',
        'Early access to new features',
        'Ad-free experience'
      ],
      popular: false,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const billingHistory = [
    {
      date: '2024-12-15',
      description: 'Free Plan',
      amount: '$0.00',
      status: 'Active'
    }
  ];

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
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h3>
                  <p className="text-gray-600">Free access to basic spiritual learning features</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">${currentPlan.price}</div>
                  <div className="text-gray-600">per month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Spiritual Learning Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      {plan.name === 'Free' && <Star className="w-8 h-8 text-white" />}
                      {plan.name === 'Devotee' && <Crown className="w-8 h-8 text-white" />}
                      {plan.name === 'Guru' && <Infinity className="w-8 h-8 text-white" />}
                    </div>
                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-gray-900">
                      ${plan.price}
                      <span className="text-sm text-gray-600 font-normal">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      disabled={plan.name === currentPlan.name}
                    >
                      {plan.name === currentPlan.name ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Billing History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-semibold text-gray-900">{item.description}</div>
                      <div className="text-sm text-gray-600">{item.date}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-900">{item.amount}</span>
                      <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
