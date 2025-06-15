import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserLimits } from "@/hooks/useUserLimits";
import RazorpayPayment from "./RazorpayPayment";

export const PricingSection = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { limits, usage } = useUserLimits();

  // Define pricing plans with detailed features
  const plans = [
    {
      name: "Free Trial",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started with Hindu scriptures",
      features: [
        "10 AI chat messages per day",
        "Create 1 quiz",
        "Access to Vedas, Puranas, Upanishads",
        "Basic scripture guidance",
        "Community support"
      ],
      limitations: [
        "No access to Mahabharata",
        "No access to Bhagavad Gita", 
        "No access to Ramayana",
        "Limited daily messages",
        "Limited quiz creation"
      ],
      buttonText: "Current Plan",
      popular: false,
      planId: null,
      current: !subscription?.subscribed
    },
    {
      name: "Devotee Plan",
      price: "₹999",
      period: "month",
      description: "Ideal for serious students of Hindu philosophy",
      features: [
        "200 AI chat messages per day",
        "Create up to 5 quizzes",
        "Access to ALL scripture categories",
        "Vedas, Puranas, Upanishads",
        "Mahabharata, Bhagavad Gita, Ramayana", 
        "Advanced scripture analysis",
        "Priority support",
        "Detailed explanations"
      ],
      limitations: [],
      buttonText: subscription?.subscription_tier === 'Devotee Plan' ? "Current Plan" : "Choose Devotee",
      popular: true,
      planId: "devotee",
      current: subscription?.subscription_tier === 'Devotee Plan'
    },
    {
      name: "Guru Plan",
      price: "₹2999",
      period: "month", 
      description: "For teachers, scholars, and advanced practitioners",
      features: [
        "Unlimited AI chat messages",
        "Unlimited quiz creation",
        "Access to ALL scripture categories",
        "Vedas, Puranas, Upanishads",
        "Mahabharata, Bhagavad Gita, Ramayana",
        "Advanced AI insights",
        "Custom learning paths",
        "Premium support",
        "Early access to new features"
      ],
      limitations: [],
      buttonText: subscription?.subscription_tier === 'Guru Plan' ? "Current Plan" : "Choose Guru",
      popular: false,
      planId: "guru",
      current: subscription?.subscription_tier === 'Guru Plan'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Spiritual Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the wisdom of Hindu scriptures with our subscription plans designed for every level of spiritual seeker
          </p>
          
          {/* Current Usage Display */}
          {user && usage && (
            <div className="mt-8 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
              <h3 className="font-semibold text-gray-800 mb-2">Your Current Usage</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Messages today: {usage.messages_sent_today}/{limits.maxDailyMessages === Infinity ? '∞' : limits.maxDailyMessages}</div>
                <div>Quizzes created: {usage.quizzes_created_total}/{limits.maxQuizzes === Infinity ? '∞' : limits.maxQuizzes}</div>
                <div>Plan: {limits.subscriptionTier}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-orange-500 border-2 scale-105' : 'border-gray-200'} ${plan.current ? 'bg-orange-50' : 'bg-white'}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="text-4xl font-bold text-orange-600">
                  {plan.price}
                  {plan.period && <span className="text-lg text-gray-500">/{plan.period}</span>}
                </div>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Features Included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                      <X className="w-4 h-4 mr-2" />
                      Limitations:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-center text-sm text-gray-600">
                          <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                {plan.current ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    {plan.buttonText}
                  </Button>
                ) : plan.planId ? (
                  <RazorpayPayment 
                    planId={plan.planId}
                    planName={plan.name}
                    price={parseInt(plan.price.replace('₹', '').replace(',', ''))}
                    buttonText={plan.buttonText}
                    className="w-full"
                  />
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include access to our AI-powered scripture guidance system
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Prices in Indian Rupees. Cancel anytime. 
          </p>
        </div>
      </div>
    </section>
  );
};
