
import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  input: string;
  loading: boolean;
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
  expandedCitations,
  onInputChange,
  onSendMessage,
  onToggleCitations,
  onSuggestionClick
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-4xl px-6">
            <MessageList
              messages={messages}
              loading={loading}
              expandedCitations={expandedCitations}
              onToggleCitations={onToggleCitations}
              onSuggestionClick={onSuggestionClick}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl px-6">
          <ChatInput
            input={input}
            loading={loading}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
