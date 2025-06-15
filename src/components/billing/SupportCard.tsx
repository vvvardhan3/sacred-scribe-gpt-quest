
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const SupportCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-0 text-white">
      <CardHeader>
        <CardTitle className="text-center text-white">Need Help with Billing?</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-white/90 mb-4">
          Our support team is here to assist you with any billing questions or concerns about your spiritual learning journey.
        </p>
        <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold">
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
};
