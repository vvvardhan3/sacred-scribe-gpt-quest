
import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">HinduGPT Assistant</h2>
          <p className="text-sm text-gray-600">Ask me anything about Hindu scriptures</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
