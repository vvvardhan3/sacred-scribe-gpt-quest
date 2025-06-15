
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import LoadingMessage from './LoadingMessage';
import WelcomeScreen from './WelcomeScreen';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  streamingMessageId?: string;
  expandedCitations: { [key: string]: boolean };
  onToggleCitations: (messageId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  streamingMessageId,
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

  // Scroll to bottom when messages are first loaded (when opening a conversation)
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages.length]);

  return (
    <div 
      className="flex-1 overflow-y-auto" 
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .flex-1.overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={onSuggestionClick} />
      ) : (
        <div className="p-6 pt-8">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={streamingMessageId === message.id}
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
