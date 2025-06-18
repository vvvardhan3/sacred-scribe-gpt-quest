import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatContainer from '@/components/chat/ChatContainer';
import ConversationSidebar from '@/components/chat/ConversationSidebar';
import WelcomeScreen from '@/components/chat/WelcomeScreen';
import FeedbackButton from '@/components/FeedbackButton';
import { useConversations } from '@/hooks/useConversations';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useUserLimits } from '@/hooks/useUserLimits';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    updateConversation,
    deleteConversation,
    renameConversation,
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
    loadMessages
  } = useChatMessages(activeConversationId);

  const { limits, usage, isAtLimit, remainingMessages } = useUserLimits();

  useEffect(() => {
    if (conversationId && conversationId !== activeConversationId) {
      setActiveConversationId(conversationId);
    }
  }, [conversationId, activeConversationId, setActiveConversationId]);

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    }
  }, [activeConversationId, loadMessages]);

  const handleNewConversation = async () => {
    const newId = await createNewConversation();
    if (newId) {
      navigate(`/chat/${newId}`);
      setSidebarOpen(false);
    }
  };

  const handleConversationSelect = (id: string) => {
    navigate(`/chat/${id}`);
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!activeConversationId) {
      const newId = await createNewConversation();
      if (newId) {
        navigate(`/chat/${newId}`);
        setTimeout(() => {
          sendMessage();
        }, 100);
      }
    } else {
      if (remainingMessages <= 3 && remainingMessages > 0 && limits?.subscriptionTier !== 'Guru Plan') {
        setShowWarningModal(true);
        return;
      }
      
      if (isAtLimit) {
        return;
      }
      
      sendMessage();
    }
  };

  const handleWarningModalContinue = () => {
    setShowWarningModal(false);
    sendMessage();
  };

  const handleCloseWarningModal = () => {
    setShowWarningModal(false);
  };

  if (conversationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewConversation={handleNewConversation}
        onConversationSelect={handleConversationSelect}
        onDeleteConversation={deleteConversation}
        onRenameConversation={renameConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col">
        {activeConversationId && messages.length > 0 ? (
          <ChatContainer
            messages={messages}
            input={input}
            loading={loading}
            streamingMessageId={streamingMessageId}
            expandedCitations={expandedCitations}
            showWarningModal={showWarningModal}
            isAtLimit={isAtLimit}
            remainingMessages={remainingMessages}
            limits={limits}
            onInputChange={setInput}
            onSendMessage={handleSendMessage}
            onToggleCitations={toggleCitations}
            onSuggestionClick={handleSuggestionClick}
            onWarningModalContinue={handleWarningModalContinue}
            onCloseWarningModal={handleCloseWarningModal}
          />
        ) : (
          <WelcomeScreen 
            onNewConversation={handleNewConversation}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>

      {/* Fixed Feedback Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <FeedbackButton />
      </div>
    </div>
  );
};

export default Chat;
