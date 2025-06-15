
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const LoadingSkeleton: React.FC = () => {
  return (
    <Card className="h-full border-0 bg-white overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-300" />
      
      <CardContent className="p-6">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-300 rounded-md mb-3 w-3/4"></div>
        
        {/* Description placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
        </div>
        
        {/* Footer placeholder */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-24"></div>
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
