
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingSkeleton: React.FC = () => {
  return (
    <Card className="h-full border-0 bg-white overflow-hidden animate-pulse min-h-[200px]">
      {/* Header placeholder */}
      <div className="p-6 pb-4">
        <div className="h-1 bg-gray-300 rounded-md mb-4 w-full"></div>
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
        </div>
      </div>
      
      <CardContent className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-24"></div>
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
