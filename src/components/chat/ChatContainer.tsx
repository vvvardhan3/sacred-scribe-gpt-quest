
import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  input: string;
  loading: boolean;
  streamingMessageId?: string;
  expandedCitations: { [key: string]: boolean };
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleCitations: (messageId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  input,
  loading,
  streamingMessageId,
  expandedCitations,
  onInputChange,
  onSendMessage,
  onToggleCitations,
  onSuggestionClick
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 min-h-0 flex flex-col max-w-4xl mx-auto w-full">
        <MessageList
          messages={messages}
          loading={loading}
          streamingMessageId={streamingMessageId}
          expandedCitations={expandedCitations}
          onToggleCitations={onToggleCitations}
          onSuggestionClick={onSuggestionClick}
        />
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          input={input}
          loading={loading}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
