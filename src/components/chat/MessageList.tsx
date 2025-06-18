import React, { useRef, useEffect, useState } from 'react';
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
  onCreateNew?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  streamingMessageId,
  expandedCitations,
  onToggleCitations,
  onSuggestionClick,
  onCreateNew
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottomImmediate = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const isNearBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  const handleScroll = () => {
    setIsUserScrolling(true);
    
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    const timeout = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
    
    setScrollTimeout(timeout);
  };

  useEffect(() => {
    if (!isUserScrolling && isNearBottom()) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (!isUserScrolling) {
          scrollToBottom();
        }
      }, 100);
    }
  }, [messages.length, isUserScrolling]);

  useEffect(() => {
    if (streamingMessageId) {
      const scrollInterval = setInterval(() => {
        if (!isUserScrolling && isNearBottom()) {
          scrollToBottomImmediate();
        }
      }, 200);

      return () => clearInterval(scrollInterval);
    }
  }, [streamingMessageId, isUserScrolling]);

  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto" 
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
      onScroll={handleScroll}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          .flex-1.overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
      {messages.length === 0 ? (
        <WelcomeScreen 
          onCreateNew={onCreateNew || (() => {})}
          onSuggestionClick={onSuggestionClick} 
        />
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
