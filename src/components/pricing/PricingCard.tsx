
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { PricingPlan } from './pricingPlans';

interface PricingCardProps {
  plan: PricingPlan;
  onPlanClick: (planId: string | null) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onPlanClick }) => {
  return (
    <Card 
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
        <div className="space-y-2">
          <div className="text-4xl font-bold text-orange-600">
            {plan.price}
            {plan.period && <span className="text-lg text-gray-500">/{plan.period}</span>}
          </div>
          {plan.originalPrice && (
            <div className="text-lg text-gray-400 line-through">
              {plan.originalPrice}/{plan.period}
            </div>
          )}
        </div>
        <CardDescription className="text-gray-600">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-green-700 mb-3 flex items-center">
            <Check className="w-4 h-4 mr-2" />
            What's Included:
          </h4>
          <ul className="space-y-2">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {plan.limitations.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-700 mb-3 flex items-center">
              <X className="w-4 h-4 mr-2" />
              Not Included:
            </h4>
            <ul className="space-y-2">
              {plan.limitations.map((limitation, limitIndex) => (
                <li key={limitIndex} className="flex items-start text-sm text-gray-600">
                  <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          variant={plan.current ? "outline" : "default"}
          onClick={() => onPlanClick(plan.planId)}
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};
