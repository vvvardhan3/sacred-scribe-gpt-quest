
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Crown } from 'lucide-react';
import RazorpayPayment from '../RazorpayPayment';

interface MessageLimitWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingMessages: number;
  subscriptionTier: string;
  onUpgrade?: () => void;
  onContinue?: () => void;
}

export const MessageLimitWarningModal: React.FC<MessageLimitWarningModalProps> = ({
  isOpen,
  onClose,
  remainingMessages,
  subscriptionTier,
  onUpgrade,
  onContinue
}) => {
  const isAtLimit = remainingMessages <= 0;
  
  const handleContinue = () => {
    onClose();
    if (onContinue) {
      onContinue();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} />
            <DialogTitle>
              {isAtLimit ? 'Daily Message Limit Reached' : 'Message Limit Warning'}
            </DialogTitle>
          </div>
          <DialogDescription className="space-y-3 pt-2">
            {isAtLimit ? (
              <p>
                You've reached your daily message limit of {subscriptionTier === 'Free Trial' ? '10' : subscriptionTier === 'Devotee Plan' ? '200' : '∞'} messages 
                for your {subscriptionTier} plan. Your messages will reset tomorrow.
              </p>
            ) : (
              <p>
                You have only <span className="font-semibold text-orange-600">{remainingMessages} message{remainingMessages !== 1 ? 's' : ''}</span> remaining 
                for today on your {subscriptionTier} plan.
              </p>
            )}
            
            {subscriptionTier !== 'Guru Plan' && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-orange-800">Upgrade for More Messages</span>
                </div>
                
                <div className="space-y-2">
                  {subscriptionTier === 'Free Trial' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Devotee Plan: 200 daily messages</span>
                        <RazorpayPayment 
                          planId="devotee"
                          planName="Devotee Plan"
                          price={499}
                          buttonText="₹499/mo"
                          className="text-xs px-3 py-1 h-auto"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Guru Plan: Unlimited messages</span>
                        <RazorpayPayment 
                          planId="guru"
                          planName="Guru Plan"
                          price={999}
                          buttonText="₹999/mo"
                          className="text-xs px-3 py-1 h-auto"
                        />
                      </div>
                    </>
                  )}
                  
                  {subscriptionTier === 'Devotee Plan' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Guru Plan: Unlimited messages</span>
                      <RazorpayPayment 
                        planId="guru"
                        planName="Guru Plan"
                        price={999}
                        buttonText="₹999/mo"
                        className="text-xs px-3 py-1 h-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleContinue}>
            {isAtLimit ? 'I Understand' : 'Continue Chatting'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
