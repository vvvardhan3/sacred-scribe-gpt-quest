
import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { MessageLimitWarningModal } from './MessageLimitWarningModal';
import { Message } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  input: string;
  loading: boolean;
  streamingMessageId?: string;
  expandedCitations: { [key: string]: boolean };
  showWarningModal?: boolean;
  isAtLimit?: boolean;
  remainingMessages?: number;
  limits?: any;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleCitations: (messageId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  onWarningModalContinue?: () => void;
  onCloseWarningModal?: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  input,
  loading,
  streamingMessageId,
  expandedCitations,
  showWarningModal = false,
  isAtLimit = false,
  remainingMessages = 0,
  limits,
  onInputChange,
  onSendMessage,
  onToggleCitations,
  onSuggestionClick,
  onWarningModalContinue,
  onCloseWarningModal
}) => {
  const getDisabledMessage = () => {
    if (isAtLimit) {
      return `You've reached your daily message limit of ${limits?.maxDailyMessages} for ${limits?.subscriptionTier} plan. Your messages will reset tomorrow.`;
    }
    return undefined;
  };

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
          disabled={isAtLimit}
          disabledMessage={getDisabledMessage()}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
        />
      </div>

      {/* Warning Modal */}
      {showWarningModal && onWarningModalContinue && onCloseWarningModal && limits && (
        <MessageLimitWarningModal
          isOpen={showWarningModal}
          onClose={onCloseWarningModal}
          remainingMessages={remainingMessages}
          subscriptionTier={limits.subscriptionTier}
          onUpgrade={() => {
            // Handle upgrade logic if needed
            onCloseWarningModal();
          }}
        />
      )}
    </div>
  );
};

export default ChatContainer;
