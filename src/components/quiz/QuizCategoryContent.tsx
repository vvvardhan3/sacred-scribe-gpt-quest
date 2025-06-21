
import React from 'react';
import { CategoryHeader } from './CategoryHeader';
import { CategoryAccessWarning } from './CategoryAccessWarning';
import { UsageLimitsCard } from './UsageLimitsCard';
import { QuotaWarning } from './QuotaWarning';
import { CreateQuizCard } from './CreateQuizCard';
import { PreviousQuizzes } from './PreviousQuizzes';
import { UserUsage, SubscriptionLimits } from '@/hooks/useUserLimits';

interface CategoryData {
  name: string;
  description: string;
  color: string;
}

interface QuizCategoryContentProps {
  categoryData: CategoryData;
  usage: UserUsage | null;
  limits: SubscriptionLimits;
  categoryAllowed: boolean;
  canCreateNewQuiz: boolean;
  remainingQuizzes: number | typeof Infinity;
  isGenerating: boolean;
  onCreateQuiz: () => void;
  onPaymentSuccess: () => void;
}

export const QuizCategoryContent: React.FC<QuizCategoryContentProps> = ({
  categoryData,
  usage,
  limits,
  categoryAllowed,
  canCreateNewQuiz,
  remainingQuizzes,
  isGenerating,
  onCreateQuiz,
  onPaymentSuccess
}) => {
  return (
    <>
      {/* Category Header */}
      <CategoryHeader 
        name={categoryData.name}
        description={categoryData.description}
        color={categoryData.color}
      />

      {/* Category Access Warning */}
      {!categoryAllowed && (
        <CategoryAccessWarning 
          categoryName={categoryData.name}
          subscriptionTier={limits.subscriptionTier}
        />
      )}

      {/* Usage Limits Display */}
      {limits.maxQuizzes !== Infinity && (
        <UsageLimitsCard
          subscriptionTier={limits.subscriptionTier}
          quizzesCreated={usage?.quizzes_created_total || 0}
          maxQuizzes={limits.maxQuizzes}
          remainingQuizzes={remainingQuizzes}
          canCreateNewQuiz={canCreateNewQuiz}
          categoryAllowed={categoryAllowed}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}

      {/* Quota Warning */}
      {!canCreateNewQuiz && categoryAllowed && (
        <QuotaWarning 
          maxQuizzes={limits.maxQuizzes}
          subscriptionTier={limits.subscriptionTier}
        />
      )}

      {/* Create New Quiz */}
      <CreateQuizCard
        categoryName={categoryData.name}
        isGenerating={isGenerating}
        canCreateNewQuiz={canCreateNewQuiz}
        onCreateQuiz={onCreateQuiz}
      />

      {/* Previous Quizzes - Only show if category is allowed */}
      {categoryAllowed && (
        <PreviousQuizzes category={categoryData.name} />
      )}
    </>
  );
};
