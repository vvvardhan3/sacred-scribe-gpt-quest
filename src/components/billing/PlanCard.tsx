
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap } from 'lucide-react';
import RazorpayPayment from '../RazorpayPayment';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
  color: string;
}

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  onPaymentSuccess: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrentPlan, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    
    try {
      // Show success message
      toast({
        title: "Payment Successful!",
        description: `Welcome to ${plan.name}! Your subscription is now active.`,
      });

      // Call the parent callback
      onPaymentSuccess();
      
      // Wait a bit for backend to process, then reload
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast({
        title: "Error",
        description: "There was an issue updating your subscription. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getIcon = () => {
    if (plan.id === 'guru') return <Crown className="w-6 h-6" />;
    if (plan.id === 'devotee') return <Zap className="w-6 h-6" />;
    return null;
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      plan.popular ? 'ring-2 ring-orange-500 scale-105' : ''
    } ${isCurrentPlan ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-medium">
          Most Popular
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2 text-sm font-medium">
          Your Current Plan
        </div>
      )}

      <CardHeader className={`${plan.popular || isCurrentPlan ? 'pt-12' : 'pt-6'}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color} text-white`}>
            {getIcon()}
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
          {plan.originalPrice && (
            <span className="text-lg text-gray-500 line-through">₹{plan.originalPrice}</span>
          )}
          <span className="text-gray-600">/{plan.period}</span>
        </div>
        
        {plan.originalPrice && (
          <div className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-gray-600">{plan.description}</p>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            What's Included
          </h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          {isCurrentPlan ? (
            <Button disabled className="w-full bg-green-500 text-white">
              <Check className="w-4 h-4 mr-2" />
              Current Plan
            </Button>
          ) : (
            <RazorpayPayment
              planId={plan.id}
              planName={plan.name}
              price={plan.price}
              onPaymentSuccess={handlePaymentSuccess}
              buttonText={isProcessing ? "Processing..." : `Upgrade to ${plan.name}`}
              disabled={isProcessing}
              className="w-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
