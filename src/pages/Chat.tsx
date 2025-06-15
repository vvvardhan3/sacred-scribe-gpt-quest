
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
    setInput,
    sendMessage,
    toggleCitations,
    handleSuggestionClick,
    resetChat
  } = useChatMessages(
    activeConversationId,
    getActiveConversation,
    updateConversation,
    createNewConversation
  );

  const handleSelectConversation = (id: string) => {
    console.log('Selecting conversation:', id);
    setActiveConversationId(id);
  };

  const handleCreateNew = async () => {
    console.log('Creating new conversation');
    resetChat();
    setActiveConversationId(null);
  };

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
              onInputChange={setInput}
              onSendMessage={sendMessage}
              onToggleCitations={toggleCitations}
              onSuggestionClick={handleSuggestionClick}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Chat;
