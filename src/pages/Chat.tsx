
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ChatContainer from '@/components/chat/ChatContainer';
import ConversationSidebar from '@/components/chat/ConversationSidebar';
import { useConversations } from '@/hooks/useConversations';
import { useChatMessages } from '@/hooks/useChatMessages';

const Chat = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    updateConversation,
    deleteConversation,
    renameConversation,
    getActiveConversation,
    loading
  } = useConversations();

  const {
    messages,
    input,
    loading: messagesLoading,
    streamingMessageId,
    expandedCitations,
    showWarningModal,
    setInput,
    sendMessage,
    toggleCitations,
    handleSuggestionClick,
    resetChat,
    handleWarningModalContinue,
    setShowWarningModal,
    canSendMessage,
    isAtLimit,
    remainingMessages,
    limits,
    usage
  } = useChatMessages(
    activeConversationId,
    getActiveConversation,
    updateConversation,
    createNewConversation
  );

  const handleSelectConversation = (id: string) => {
    console.log('Selecting conversation from sidebar:', id);
    console.log('Current active conversation:', activeConversationId);
    
    if (id !== activeConversationId) {
      console.log('Setting new active conversation:', id);
      setActiveConversationId(id);
    } else {
      console.log('Conversation already active, no change needed');
    }
  };

  const handleCreateNew = () => {
    console.log('Creating new conversation from sidebar');
    resetChat();
    setActiveConversationId(null);
  };

  // Debug logging
  React.useEffect(() => {
    console.log('Chat component state:', {
      activeConversationId,
      messagesCount: messages.length,
      messages: messages.map(m => ({ id: m.id, role: m.role, content: m.content.substring(0, 50) + '...' })),
      isAtLimit,
      remainingMessages,
      canSendMessage,
      dailyUsage: usage?.messages_sent_today,
      maxDaily: limits?.maxDailyMessages
    });
  }, [activeConversationId, messages, isAtLimit, remainingMessages, canSendMessage, usage, limits]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">हिं</span>
          </div>
          <p className="text-gray-600">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SidebarProvider>
        <div className="flex w-full h-screen">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onCreateNew={handleCreateNew}
            onRename={renameConversation}
            onDelete={deleteConversation}
          />
          
          <SidebarInset className="flex-1 flex flex-col">
            <ChatContainer
              messages={messages}
              input={input}
              loading={messagesLoading}
              streamingMessageId={streamingMessageId}
              expandedCitations={expandedCitations}
              showWarningModal={showWarningModal}
              isAtLimit={isAtLimit}
              remainingMessages={remainingMessages}
              limits={limits}
              onInputChange={setInput}
              onSendMessage={sendMessage}
              onToggleCitations={toggleCitations}
              onSuggestionClick={handleSuggestionClick}
              onWarningModalContinue={handleWarningModalContinue}
              onCloseWarningModal={() => setShowWarningModal(false)}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Chat;
