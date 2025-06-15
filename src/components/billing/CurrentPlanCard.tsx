
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CurrentPlanCardProps {
  subscription: any;
  currentPlan: any;
  subscriptionLoading: boolean;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  subscription,
  currentPlan,
  subscriptionLoading
}) => {
  if (subscriptionLoading || !currentPlan) return null;

  return (
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
            <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h3>
            <p className="text-gray-600">{currentPlan.description}</p>
            {subscription?.subscription_end && subscription?.subscribed && (
              <p className="text-sm text-gray-500 mt-2">
                Valid until: {new Date(subscription.subscription_end).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">₹{currentPlan.price || 0}</div>
            <div className="text-gray-600">per {currentPlan.period}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
