
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
        'Community support'
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      description: 'For serious students and scholars',
      features: [
        'Unlimited AI chat messages',
        'All quiz categories',
        'Advanced scripture analysis',
        'Priority support',
        'Offline access',
        'Progress tracking'
      ],
      popular: true,
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const
    },
    {
      name: 'Lifetime',
      price: '$99.99',
      description: 'One-time payment for lifetime access',
      features: [
        'Everything in Premium',
        'Lifetime updates',
        'Exclusive content',
        'Early access to new features',
        'Personal mentor sessions',
        'Custom study plans'
      ],
      popular: false,
      buttonText: 'Buy Lifetime',
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan to deepen your understanding of Hindu philosophy and scriptures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-orange-500 border-2 shadow-xl' : 'border-gray-200'}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-xl font-semibold text-gray-900">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
              </div>
              <p className="text-gray-600 mt-2">{plan.description}</p>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' : ''}`}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600">
          All plans include access to our comprehensive scripture database and community forums
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
