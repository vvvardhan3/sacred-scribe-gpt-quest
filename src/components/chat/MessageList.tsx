
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottomImmediate = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // Check if user is near the bottom of the chat
  const isNearBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Handle user scroll events
  const handleScroll = () => {
    setIsUserScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Reset user scrolling flag after 1 second of no scrolling
    const timeout = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
    
    setScrollTimeout(timeout);
  };

  // Scroll when messages change (new messages added)
  useEffect(() => {
    // Only auto-scroll if user is not manually scrolling and is near bottom
    if (!isUserScrolling && isNearBottom()) {
      scrollToBottom();
    }
  }, [messages, isUserScrolling]);

  // Scroll when messages are first loaded (when opening a conversation)
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (!isUserScrolling) {
          scrollToBottom();
        }
      }, 100);
    }
  }, [messages.length, isUserScrolling]);

  // Scroll during streaming - but only if user is not scrolling and is near bottom
  useEffect(() => {
    if (streamingMessageId) {
      const scrollInterval = setInterval(() => {
        if (!isUserScrolling && isNearBottom()) {
          scrollToBottomImmediate();
        }
      }, 200); // Reduced frequency to 200ms for smoother experience

      return () => clearInterval(scrollInterval);
    }
  }, [streamingMessageId, isUserScrolling]);

  // Cleanup timeout on unmount
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
