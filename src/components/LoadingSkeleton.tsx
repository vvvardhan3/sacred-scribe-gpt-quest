
import React from 'react';
import { Card } from '@/components/ui/card';

const LoadingSkeleton: React.FC = () => {
  return (
    <Card className="h-full border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative animate-pulse">
      <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-400" />
      <div className="p-6 h-full flex flex-col">
        <div className="mb-4 flex justify-between items-start">
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded-md mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
          </div>
          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-24"></div>
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
        </div>
      </div>
    </Card>
  );
};

export default LoadingSkeleton;
