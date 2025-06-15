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
    getActiveConversation
  } = useConversations();

  const {
    messages,
    input,
    loading,
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
    setActiveConversationId(id);
  };

  const handleCreateNew = () => {
    const newId = createNewConversation();
    resetChat();
  };

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
              loading={loading}
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
