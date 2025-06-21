
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RazorpayPayment from '@/components/RazorpayPayment';

// Mock Razorpay
const mockRazorpay = vi.fn();
global.Razorpay = mockRazorpay;

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ 
        data: { session: { access_token: 'test', user: { id: 'user-123', email: 'test@example.com' } } } 
      }))
    },
    functions: {
      invoke: vi.fn()
    }
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}));

const PaymentWrapper = ({ planId = 'devotee', price = 499 }) => (
  <BrowserRouter>
    <RazorpayPayment 
      planId={planId}
      planName="Devotee Plan"
      price={price}
      buttonText="Upgrade to Devotee"
      className="test-payment-button"
    />
  </BrowserRouter>
);

describe('Payment Success Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful payment flow
    mockRazorpay.mockImplementation((options) => ({
      open: vi.fn(() => {
        // Simulate successful payment
        options.handler({
          razorpay_payment_id: 'pay_test123',
          razorpay_order_id: 'order_test123',
          razorpay_signature: 'signature_test123'
        });
      })
    }));
  });

  it('renders payment button correctly', () => {
    render(<PaymentWrapper />);
    
    expect(screen.getByText('Upgrade to Devotee')).toBeInTheDocument();
  });

  it('handles successful payment flow', async () => {
    const mockInvoke = vi.fn()
      .mockResolvedValueOnce({ // create-subscription call
        data: { 
          order_id: 'order_test123',
          amount: 49900,
          currency: 'INR'
        }
      })
      .mockResolvedValueOnce({ // verify-payment call
        data: { success: true }
      });
    
    const { supabase } = require('@/integrations/supabase/client');
    supabase.functions.invoke = mockInvoke;

    render(<PaymentWrapper />);
    
    const paymentButton = screen.getByText('Upgrade to Devotee');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('razorpay-create-subscription', expect.any(Object));
    });
  });

  it('handles payment verification', async () => {
    const mockInvoke = vi.fn()
      .mockResolvedValueOnce({ 
        data: { 
          order_id: 'order_test123',
          amount: 49900,
          currency: 'INR'
        }
      })
      .mockResolvedValueOnce({ 
        data: { success: true }
      });
    
    const { supabase } = require('@/integrations/supabase/client');
    supabase.functions.invoke = mockInvoke;

    render(<PaymentWrapper />);
    
    const paymentButton = screen.getByText('Upgrade to Devotee');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith('razorpay-verify-payment', 
        expect.objectContaining({
          body: expect.objectContaining({
            razorpay_payment_id: 'pay_test123',
            razorpay_order_id: 'order_test123',
            razorpay_signature: 'signature_test123'
          })
        })
      );
    });
  });

  it('handles different plan types', () => {
    render(<PaymentWrapper planId="guru" price={999} />);
    
    expect(screen.getByText('Upgrade to Devotee')).toBeInTheDocument();
  });

  it('shows loading state during payment', async () => {
    const mockInvoke = vi.fn(() => new Promise(resolve => 
      setTimeout(() => resolve({ data: { order_id: 'test' } }), 100)
    ));
    
    const { supabase } = require('@/integrations/supabase/client');
    supabase.functions.invoke = mockInvoke;

    render(<PaymentWrapper />);
    
    const paymentButton = screen.getByText('Upgrade to Devotee');
    fireEvent.click(paymentButton);

    // Should show loading state
    expect(paymentButton).toBeDisabled();
  });
});
