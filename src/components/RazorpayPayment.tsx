
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';

interface RazorpayPaymentProps {
  planId: string;
  planName: string;
  price: number;
  onSuccess?: () => void;
  buttonText?: string;
  className?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  planId,
  planName,
  price,
  onSuccess,
  buttonText,
  className
}) => {
  const { toast } = useToast();
  const { createSubscription, verifyPayment, refetch } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      // console.log('Starting payment process for plan:', planId);
      
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast({
          title: "Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // console.log('Razorpay script loaded successfully');

      // Create order
      const orderData = await createSubscription(planId);
      // console.log('Order created:', orderData);
      
      const options = {
        key: 'rzp_test_hDWzj3XChB3yxM',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        order_id: orderData.subscription_id,
        name: 'HinduGPT',
        description: `Subscription to ${planName}`,
        handler: async (response: any) => {
          try {
            // console.log('Payment successful:', response);
            
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Force refresh subscription data
            // console.log('Refreshing subscription data...');
            await refetch();

            toast({
              title: "Success!",
              description: `Welcome to ${planName}! Your subscription is now active.`,
            });

            // Call onSuccess callback if provided
            if (onSuccess) onSuccess();
            
            // Additional refresh after a short delay to ensure UI updates
            setTimeout(() => {
              refetch();
            }, 1000);

          } catch (error) {
            // console.error('Payment verification failed:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if your payment was deducted.",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            // console.log('Payment modal closed by user');
            setIsLoading(false);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
        },
        theme: {
          color: '#f97316'
        }
      };

      // console.log('Opening Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      // console.error('Payment initiation failed:', error);
      
      let errorMessage = "Failed to initiate payment. Please try again.";
      
      if (error instanceof Error) {
        // Extract more specific error messages
        if (error.message.includes('authentication') || error.message.includes('auth')) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.message.includes('Razorpay')) {
          errorMessage = "Payment gateway error. Please try again later.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      className={className || "w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}
    >
      {isLoading ? "Processing..." : (buttonText || `Subscribe to ${planName} - ₹${price}`)}
    </Button>
  );
};

export default RazorpayPayment;
