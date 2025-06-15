
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for beginners exploring Hindu scriptures',
      features: [
        '10 AI chat messages per day',
        'Basic quiz access',
        'Limited scripture categories',
        'Community support',
        'Mobile app access'
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Premium',
      price: '₹499',
      period: '/month',
      description: 'For serious students and scholars',
      features: [
        'Unlimited AI chat messages',
        'All quiz categories',
        'Advanced scripture analysis',
        'Priority support',
        'Offline access',
        'Progress tracking',
        'Detailed analytics',
        'Custom study plans'
      ],
      popular: true,
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const
    },
    {
      name: 'Pro',
      price: '₹999',
      period: '/month',
      description: 'For teachers and spiritual guides',
      features: [
        'Everything in Premium',
        'Group management tools',
        'Student progress tracking',
        'Custom quiz creation',
        'Bulk user management',
        'Advanced reporting',
        'API access',
        'White-label options'
      ],
      popular: false,
      buttonText: 'Start Free Trial',
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Choose Your Learning Path
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan to deepen your understanding of Hindu philosophy and scriptures. 
          All plans include our comprehensive scripture database and community forums.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={plan.name} className={`relative hover:scale-105 transition-all duration-300 ${plan.popular ? 'border-orange-500 border-2 shadow-2xl' : 'border-gray-200 shadow-lg'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-1 shadow-lg">
                  <Star className="w-4 h-4 fill-current" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}
            
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-xl font-semibold text-gray-900">{plan.name}</CardTitle>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
              </div>
              <p className="text-gray-600 mt-3 text-sm">{plan.description}</p>
            </CardHeader>

            <CardContent className="pt-0 pb-8">
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant} 
                className={`w-full py-3 font-semibold transition-all duration-200 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl' 
                    : 'border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-orange-100">
          <p className="text-gray-600 text-sm mb-2">
            🎉 <strong>Special Launch Offer:</strong> Get 2 months free on any annual plan!
          </p>
          <p className="text-gray-500 text-xs">
            All prices are in Indian Rupees (INR). Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
