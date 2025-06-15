import { useUserLimits } from '@/hooks/useUserLimits';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MessageCircle, BookOpen, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RazorpayPayment from '../RazorpayPayment';

export const UsageLimitDisplay = () => {
  const { usage, limits, loading } = useUserLimits();

  if (loading || !usage) {
    return null;
  }

  const messageProgress = limits.maxDailyMessages === Infinity 
    ? 100 
    : (usage.messages_sent_today / limits.maxDailyMessages) * 100;

  const quizProgress = limits.maxQuizzes === Infinity 
    ? 100 
    : (usage.quizzes_created_total / limits.maxQuizzes) * 100;

  const isNearLimit = messageProgress > 80 || quizProgress > 80;
  const isAtLimit = messageProgress >= 100 || quizProgress >= 100;

  return (
    <Card className={`mb-4 ${isAtLimit ? 'border-red-500' : isNearLimit ? 'border-yellow-500' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-sm">{limits.subscriptionTier} Plan</span>
          </div>
          {(limits.subscriptionTier === 'Free Trial' || limits.subscriptionTier === 'Devotee') && (
            <div className="flex gap-2">
              {limits.subscriptionTier === 'Free Trial' && (
                <>
                  <RazorpayPayment 
                    planId="devotee"
                    planName="Devotee Plan"
                    price={999}
                    buttonText="Upgrade"
                    className="text-xs px-2 py-1 h-auto"
                  />
                  <RazorpayPayment 
                    planId="guru"
                    planName="Guru Plan"
                    price={2999}
                    buttonText="Go Pro"
                    className="text-xs px-2 py-1 h-auto"
                  />
                </>
              )}
              {limits.subscriptionTier === 'Devotee Plan' && (
                <RazorpayPayment 
                  planId="guru"
                  planName="Guru Plan"
                  price={2999}
                  buttonText="Go Pro"
                  className="text-xs px-2 py-1 h-auto"
                />
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          {/* Messages Usage */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Daily Messages</span>
              </div>
              <span className="text-xs text-gray-600">
                {usage.messages_sent_today}/{limits.maxDailyMessages === Infinity ? '∞' : limits.maxDailyMessages}
              </span>
            </div>
            {limits.maxDailyMessages !== Infinity && (
              <Progress 
                value={messageProgress} 
                className={`h-2 ${messageProgress >= 100 ? 'bg-red-100' : messageProgress > 80 ? 'bg-yellow-100' : 'bg-gray-100'}`}
              />
            )}
          </div>

          {/* Quiz Creation Usage */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="text-sm">Quizzes Created</span>
              </div>
              <span className="text-xs text-gray-600">
                {usage.quizzes_created_total}/{limits.maxQuizzes === Infinity ? '∞' : limits.maxQuizzes}
              </span>
            </div>
            {limits.maxQuizzes !== Infinity && (
              <Progress 
                value={quizProgress} 
                className={`h-2 ${quizProgress >= 100 ? 'bg-red-100' : quizProgress > 80 ? 'bg-yellow-100' : 'bg-gray-100'}`}
              />
            )}
          </div>
        </div>

        {isAtLimit && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            You've reached your usage limits. Upgrade your plan to continue using the service.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
