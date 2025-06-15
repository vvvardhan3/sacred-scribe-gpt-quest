
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Infinity, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RazorpayPayment from '@/components/RazorpayPayment';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  color: string;
}

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan: boolean;
  onPaymentSuccess?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrentPlan, onPaymentSuccess }) => {
  return (
    <Card className={`relative bg-white border-2 ${plan.popular ? 'border-orange-500 shadow-lg' : 'border-gray-200'} hover:shadow-md transition-shadow h-full flex flex-col`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center flex-shrink-0">
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
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow space-y-4">
          <div className="text-center mx-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="font-semibold text-green-700 hover:text-green-800 hover:bg-green-50 border-green-200 mx-auto"
                >
                  What's Included
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-green-700">
                    {plan.name} Features
                  </DialogTitle>
                </DialogHeader>
                <ul className="space-y-3 mt-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="mt-6 pt-4">
          {isCurrentPlan ? (
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
              onSuccess={onPaymentSuccess}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
