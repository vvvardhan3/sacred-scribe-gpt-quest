
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ChatNavigation from '@/components/chat/ChatNavigation';
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
    resetChat();
  };

  const handleCreateNew = () => {
    const newId = createNewConversation();
    resetChat();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onCreateNew={handleCreateNew}
            onRename={renameConversation}
            onDelete={deleteConversation}
          />
          
          <SidebarInset className="flex-1">
            <div className="flex flex-col h-screen">
              <ChatNavigation />

              <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
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
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Chat;
