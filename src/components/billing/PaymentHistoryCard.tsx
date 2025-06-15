
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Download } from 'lucide-react';

interface PaymentHistoryCardProps {
  payments: any[];
  paymentsLoading: boolean;
}

export const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
  payments,
  paymentsLoading
}) => {
  return (
    <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Payment History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paymentsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No payment history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <div className="font-semibold text-gray-900">{payment.plan_name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(payment.created_at).toLocaleDateString('en-IN')} • Payment ID: {payment.razorpay_payment_id}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">₹{payment.amount / 100}</span>
                  <Badge className="bg-green-100 text-green-800">{payment.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
