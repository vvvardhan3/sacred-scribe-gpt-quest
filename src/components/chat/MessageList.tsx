
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import LoadingMessage from './LoadingMessage';
import WelcomeScreen from './WelcomeScreen';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  expandedCitations: { [key: string]: boolean };
  onToggleCitations: (messageId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  expandedCitations,
  onToggleCitations,
  onSuggestionClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={onSuggestionClick} />
      ) : (
        <div className="p-6 pt-8">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              expandedCitations={expandedCitations}
              onToggleCitations={onToggleCitations}
            />
          ))}
          
          {loading && <LoadingMessage />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
