
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';
import { useMessageState } from './useMessageState';
import { 
  sendMessageToAPI, 
  createUserMessage, 
  createAssistantMessage, 
  createErrorMessage,
  handleTitleGeneration 
} from '@/utils/messageOperations';

export const useChatMessages = (
  activeConversationId: string | null,
  getActiveConversation: () => any,
  updateConversation: (id: string, updates: any) => void,
  createNewConversation: () => string
) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const {
    messages,
    setMessages,
    titleGenerated,
    setTitleGenerated,
    resetMessages
  } = useMessageState(activeConversationId, getActiveConversation);

  // Save messages to active conversation
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      handleTitleGeneration(
        messages,
        activeConversationId,
        titleGenerated,
        setTitleGenerated,
        updateConversation,
        getActiveConversation
      );
    }
  }, [messages, activeConversationId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    console.log('Sending message:', input);

    // Create new conversation if none is active
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      console.log('Creating new conversation');
      currentConvId = createNewConversation();
    }

    const userMessage = createUserMessage(input);
    console.log('Adding user message:', userMessage);
    
    // Add user message immediately
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      console.log('Updated messages after user message:', newMessages);
      return newMessages;
    });
    
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const data = await sendMessageToAPI(currentInput);
      const assistantMessage = createAssistantMessage(data.answer, data.citations);

      console.log('Adding assistant message:', assistantMessage);
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        console.log('Updated messages after assistant message:', newMessages);
        return newMessages;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage = createErrorMessage();
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCitations = (messageId: string) => {
    // This function is kept for compatibility but not used with inline citations
    setExpandedCitations(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const resetChat = () => {
    console.log('Resetting chat');
    resetMessages();
    setInput('');
    setExpandedCitations({});
  };

  return {
    messages,
    input,
    loading,
    expandedCitations,
    setInput,
    sendMessage,
    toggleCitations,
    handleSuggestionClick,
    resetChat
  };
};
