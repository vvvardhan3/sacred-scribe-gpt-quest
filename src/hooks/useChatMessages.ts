
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
  createNewConversation: () => Promise<string>
) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | undefined>();
  const [expandedCitations, setExpandedCitations] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const {
    messages,
    addMessage,
    titleGenerated,
    setTitleGenerated,
    resetMessages,
    isLoadingMessages
  } = useMessageState(activeConversationId, getActiveConversation);

  // Save messages to active conversation whenever messages change
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      console.log('Saving messages to conversation:', activeConversationId, messages);
      
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
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    console.log('Sending message:', trimmedInput);

    // Create new conversation if none is active
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      console.log('Creating new conversation');
      currentConvId = await createNewConversation();
      if (!currentConvId) {
        toast({
          title: "Error",
          description: "Failed to create new conversation. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    const userMessage = createUserMessage(trimmedInput);
    console.log('Adding user message:', userMessage);
    
    // Add user message immediately
    addMessage(userMessage);
    
    setInput('');
    setLoading(true);

    try {
      const data = await sendMessageToAPI(trimmedInput);
      const assistantMessage = createAssistantMessage(data.answer, data.citations);

      console.log('Adding assistant message:', assistantMessage);
      
      // Set this message as streaming
      setStreamingMessageId(assistantMessage.id);
      
      addMessage(assistantMessage);

      // Stop streaming after a delay (simulating the time it takes to stream)
      setTimeout(() => {
        setStreamingMessageId(undefined);
      }, data.answer.length * 20 + 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage = createErrorMessage();
      addMessage(errorMessage);
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
    console.log('Setting input from suggestion:', suggestion);
    setInput(suggestion);
  };

  const resetChat = () => {
    console.log('Resetting chat');
    resetMessages();
    setInput('');
    setExpandedCitations({});
    setStreamingMessageId(undefined);
  };

  return {
    messages,
    input,
    loading: loading || isLoadingMessages,
    streamingMessageId,
    expandedCitations,
    setInput,
    sendMessage,
    toggleCitations,
    handleSuggestionClick,
    resetChat
  };
};
