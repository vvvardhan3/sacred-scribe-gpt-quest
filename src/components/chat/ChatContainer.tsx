
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '@/hooks/useChatMessages';

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
    <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl border border-orange-100">
      <ChatHeader />

      <MessageList
        messages={messages}
        loading={loading}
        expandedCitations={expandedCitations}
        onToggleCitations={onToggleCitations}
        onSuggestionClick={onSuggestionClick}
      />

      <ChatInput
        input={input}
        loading={loading}
        onInputChange={onInputChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default ChatContainer;
