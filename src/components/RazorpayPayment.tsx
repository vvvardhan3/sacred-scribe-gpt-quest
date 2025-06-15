
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';

interface RazorpayPaymentProps {
  planId: string;
  planName: string;
  price: number;
  onSuccess?: () => void;
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
  onSuccess
}) => {
  const { toast } = useToast();
  const { createSubscription, verifyPayment } = useSubscription();

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
    try {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast({
          title: "Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create order
      const orderData = await createSubscription(planId);
      console.log('Order created:', orderData);
      
      const options = {
        key: 'rzp_test_hDWzj3XChB3yxM',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        order_id: orderData.subscription_id,
        name: 'HinduGPT',
        description: `Subscription to ${planName}`,
        handler: async (response: any) => {
          try {
            console.log('Payment successful:', response);
            
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast({
              title: "Success!",
              description: `Welcome to ${planName}! Your subscription is now active.`,
            });

            if (onSuccess) onSuccess();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if your payment was deducted.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal closed');
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

      console.log('Opening Razorpay with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
    >
      Subscribe to {planName} - ₹{price}
    </Button>
  );
};

export default RazorpayPayment;
