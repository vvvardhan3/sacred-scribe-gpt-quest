
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ChatHeader: React.FC = () => {
  return (
    <>
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-orange-100">
                ← Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center ml-4">
              <h1 className="text-xl font-semibold text-gray-900">AI Scripture Chat</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Header */}
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
    </>
  );
};

export default ChatHeader;
