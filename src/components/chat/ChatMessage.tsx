
import React from 'react';
import { Message } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import StreamingMessage from './StreamingMessage';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming = false }) => {
  const { user } = useAuth();

  // Function to get user initials
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    
    const displayName = user?.user_metadata?.display_name;
    if (displayName) {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    
    // Fallback to email
    const emailParts = user.email.split('@')[0];
    const nameParts = emailParts.split(/[._-]/);
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return emailParts.charAt(0).toUpperCase();
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start space-x-4 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {message.role === 'user' ? (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{getUserInitials()}</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">हिं</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-2">
          {message.role === 'user' ? (
            <div className="rounded-2xl px-5 py-4 shadow-sm bg-blue-600 text-white">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          ) : (
            <StreamingMessage message={message} isStreaming={isStreaming} />
          )}
          
          {/* Timestamp */}
          <div className={`text-xs px-1 ${
            message.role === 'user' ? 'text-right text-gray-500' : 'text-left text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
