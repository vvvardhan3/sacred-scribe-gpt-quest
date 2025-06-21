
import React from 'react';
import { Crown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CategoryAccessWarningProps {
  categoryName: string;
  subscriptionTier: string;
}

export const CategoryAccessWarning: React.FC<CategoryAccessWarningProps> = ({ 
  categoryName, 
  subscriptionTier 
}) => {
  return (
    <Alert className="mb-8 border-orange-200 bg-orange-50">
      <Crown className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>{categoryName}</strong> is not available in your current plan ({subscriptionTier}). 
        Upgrade your subscription to access this category.
      </AlertDescription>
    </Alert>
  );
};
