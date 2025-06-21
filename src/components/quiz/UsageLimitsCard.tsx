
import React from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RazorpayPayment from '@/components/RazorpayPayment';

interface UsageLimitsCardProps {
  subscriptionTier: string;
  quizzesCreated: number;
  maxQuizzes: number;
  remainingQuizzes: number | typeof Infinity;
  canCreateNewQuiz: boolean;
  categoryAllowed: boolean;
  onPaymentSuccess: () => void;
}

export const UsageLimitsCard: React.FC<UsageLimitsCardProps> = ({
  subscriptionTier,
  quizzesCreated,
  maxQuizzes,
  remainingQuizzes,
  canCreateNewQuiz,
  categoryAllowed,
  onPaymentSuccess
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-500" />
          Quiz Creation Status - {subscriptionTier}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Quizzes Created: {quizzesCreated} / {maxQuizzes}
            </p>
            <p className="text-sm text-gray-600">
              Remaining: {remainingQuizzes === Infinity ? '∞' : remainingQuizzes}
            </p>
          </div>
          {(!canCreateNewQuiz || !categoryAllowed) && (
            <div className="flex gap-2">
              <RazorpayPayment 
                planId="devotee"
                planName="Devotee Plan"
                price={499}
                onPaymentSuccess={onPaymentSuccess}
                buttonText="Upgrade to Devotee"
                className="text-sm px-3 py-1 h-8"
              />
              <RazorpayPayment 
                planId="guru"
                planName="Guru Plan"
                price={999}
                onPaymentSuccess={onPaymentSuccess}
                buttonText="Upgrade to Guru"
                className="text-sm px-3 py-1 h-8"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
