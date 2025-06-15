
import React from 'react';

interface UsageDisplayProps {
  usage: {
    messages_sent_today: number;
    quizzes_created_total: number;
  };
  limits: {
    maxDailyMessages: number;
    maxQuizzes: number;
    subscriptionTier: string;
  };
}

export const UsageDisplay: React.FC<UsageDisplayProps> = ({ usage, limits }) => {
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
      <h3 className="font-semibold text-gray-800 mb-2">Your Current Usage</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <div>Messages today: {usage.messages_sent_today}/{limits.maxDailyMessages === Infinity ? '∞' : limits.maxDailyMessages}</div>
        <div>Quizzes created: {usage.quizzes_created_total}/{limits.maxQuizzes === Infinity ? '∞' : limits.maxQuizzes}</div>
        <div>Current plan: {limits.subscriptionTier}</div>
      </div>
    </div>
  );
};
