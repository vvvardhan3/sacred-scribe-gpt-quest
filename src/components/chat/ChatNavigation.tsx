
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

const ChatNavigation: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-4 border-b border-orange-100 bg-white/80 backdrop-blur-sm">
      <SidebarTrigger />
      <Link to="/dashboard">
        <Button variant="ghost" size="sm" className="hover:bg-orange-100">
          ← Back to Dashboard
        </Button>
      </Link>
      <div className="flex items-center ml-4">
        <h1 className="text-xl font-semibold text-gray-900">AI Scripture Chat</h1>
      </div>
    </div>
  );
};

export default ChatNavigation;
