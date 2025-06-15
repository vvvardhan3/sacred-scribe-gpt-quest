
import React from 'react';

const LoadingMessage: React.FC = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start space-x-4 max-w-[80%]">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">हिं</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">Thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
