
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import ChatContainer from '@/components/chat/ChatContainer';
import ConversationSidebar from '@/components/chat/ConversationSidebar';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import ChatInput from '@/components/chat/ChatInput';
import FeedbackButton from '@/components/FeedbackButton';
import { useConversations } from '@/hooks/useConversations';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useUserLimits } from '@/hooks/useUserLimits';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    updateConversation,
    deleteConversation,
    renameConversation,
    getActiveConversation,
    loading: conversationsLoading
  } = useConversations();

  const {
    messages,
    input,
    loading,
    streamingMessageId,
    expandedCitations,
    sendMessage,
    setInput,
    toggleCitations,
    handleSuggestionClick,
    showWarningModal: hookShowWarningModal,
    handleWarningModalContinue: hookHandleWarningModalContinue,
    setShowWarningModal: setHookShowWarningModal,
    canSendMessage,
    remainingMessages,
    limits,
    usage
  } = useChatMessages(activeConversationId, getActiveConversation, updateConversation, createNewConversation);

  const { canSendMessage: userCanSendMessage } = useUserLimits();

  useEffect(() => {
    if (conversationId && conversationId !== activeConversationId) {
      setActiveConversationId(conversationId);
    }
  }, [conversationId, activeConversationId, setActiveConversationId]);

  const handleNewConversation = async () => {
    console.log('Creating new conversation...');
    const newId = await createNewConversation();
    if (newId) {
      console.log('New conversation created with ID:', newId);
      navigate(`/chat/${newId}`);
    } else {
      console.error('Failed to create new conversation');
    }
  };

  const handleConversationSelect = (id: string) => {
    navigate(`/chat/${id}`);
  };

  const handleSendMessage = async () => {
    if (!activeConversationId) {
      console.log('No active conversation, creating new one...');
      const newId = await createNewConversation();
      if (newId) {
        navigate(`/chat/${newId}`);
        // Wait a bit for navigation to complete, then send message
        setTimeout(() => {
          sendMessage();
        }, 100);
      }
    } else {
      sendMessage();
    }
  };

  const handleSuggestionClickWithConversation = async (suggestion: string) => {
    if (!activeConversationId) {
      console.log('No active conversation for suggestion, creating new one...');
      const newId = await createNewConversation();
      if (newId) {
        navigate(`/chat/${newId}`);
        // Wait for navigation and set the input
        setTimeout(() => {
          handleSuggestionClick(suggestion);
          // Then send the message automatically
          setTimeout(() => {
            sendMessage();
          }, 50);
        }, 100);
      }
    } else {
      handleSuggestionClick(suggestion);
      // Send the message automatically after setting the input
      setTimeout(() => {
        sendMessage();
      }, 50);
    }
  };

  const isAtLimit = !userCanSendMessage();

  if (conversationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-gray-50 relative w-full">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleConversationSelect}
          onCreateNew={handleNewConversation}
          onRename={renameConversation}
          onDelete={deleteConversation}
        />
        
        <div className="flex-1 flex flex-col">
          {activeConversationId && messages.length > 0 ? (
            <ChatContainer
              messages={messages}
              input={input}
              loading={loading}
              streamingMessageId={streamingMessageId}
              expandedCitations={expandedCitations}
              showWarningModal={hookShowWarningModal}
              isAtLimit={isAtLimit}
              remainingMessages={remainingMessages}
              limits={limits}
              onInputChange={setInput}
              onSendMessage={handleSendMessage}
              onToggleCitations={toggleCitations}
              onSuggestionClick={handleSuggestionClickWithConversation}
              onWarningModalContinue={hookHandleWarningModalContinue}
              onCloseWarningModal={() => setHookShowWarningModal(false)}
              onCreateNew={handleNewConversation}
            />
          ) : (
            <div className="flex-1 flex flex-col">
              <WelcomeScreen 
                onCreateNew={handleNewConversation}
                onSuggestionClick={handleSuggestionClickWithConversation}
              />
              <div className="max-w-4xl mx-auto w-full">
                <ChatInput
                  input={input}
                  loading={loading}
                  disabled={isAtLimit}
                  onInputChange={setInput}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          )}
        </div>

        {/* Fixed Feedback Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <FeedbackButton />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
