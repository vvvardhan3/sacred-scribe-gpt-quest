
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuotaWarningProps {
  maxQuizzes: number;
  subscriptionTier: string;
}

export const QuotaWarning: React.FC<QuotaWarningProps> = ({ maxQuizzes, subscriptionTier }) => {
  return (
    <Alert className="mb-8 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        You've reached your quiz creation limit of {maxQuizzes} for {subscriptionTier} plan. 
        Upgrade your subscription to create more quizzes and unlock additional features.
      </AlertDescription>
    </Alert>
  );
};
