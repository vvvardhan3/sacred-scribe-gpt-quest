
import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-2xl">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">HinduGPT Assistant</h2>
            <Sparkles className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600 mt-1">Ask me anything about Hindu scriptures and philosophy</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 font-medium">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
