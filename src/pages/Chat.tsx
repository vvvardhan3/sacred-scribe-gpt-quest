
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import ConversationSidebar from '@/components/chat/ConversationSidebar';
import { useConversations } from '@/hooks/useConversations';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

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

  // Load messages when active conversation changes
  useEffect(() => {
    const activeConv = getActiveConversation();
    if (activeConv) {
      const messagesWithDates = activeConv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithDates);
    } else {
      setMessages([]);
    }
  }, [activeConversationId, getActiveConversation]);

  // Save messages to active conversation
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const title = messages.length === 1 && messages[0].role === 'user' 
        ? messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '')
        : getActiveConversation()?.title || 'New Conversation';
      
      updateConversation(activeConversationId, {
        messages,
        lastMessage: lastMessage.content.slice(0, 100),
        title
      });
    }
  }, [messages, activeConversationId]);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setExpandedCitations({});
  };

  const handleCreateNew = () => {
    const newId = createNewConversation();
    setMessages([]);
    setInput('');
    setExpandedCitations({});
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Create new conversation if none is active
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      currentConvId = createNewConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      console.log('Sending message to chat-ask function:', currentInput);

      const { data, error } = await supabase.functions.invoke('chat-ask', {
        body: { message: currentInput }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        citations: data.citations || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm unable to process your request at the moment. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCitations = (messageId: string) => {
    setExpandedCitations(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
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
              <div className="flex items-center gap-2 p-4 border-b border-orange-100 bg-white/80 backdrop-blur-sm">
                <SidebarTrigger />
                <div className="flex-1">
                  <ChatHeader />
                </div>
              </div>

              <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl border border-orange-100">
                  <MessageList
                    messages={messages}
                    loading={loading}
                    expandedCitations={expandedCitations}
                    onToggleCitations={toggleCitations}
                    onSuggestionClick={handleSuggestionClick}
                  />

                  <ChatInput
                    input={input}
                    loading={loading}
                    onInputChange={setInput}
                    onSendMessage={sendMessage}
                  />
                </div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Chat;
