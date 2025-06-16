
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';
import { useMessageState } from './useMessageState';
import { useUserLimits } from './useUserLimits';
import { 
  sendMessageToAPI, 
  createUserMessage, 
  createAssistantMessage, 
  createErrorMessage 
} from '@/utils/messageOperations';
import { conversationDb } from '@/utils/conversationDatabase';
import { generateTitle } from '@/utils/titleGenerator';

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

  // Add user limits hook for subscription-based restrictions
  const { canSendMessage, incrementMessageCount, limits, usage } = useUserLimits();

  const {
    messages,
    addMessage,
    titleGenerated,
    setTitleGenerated,
    resetMessages,
    isLoadingMessages
  } = useMessageState(activeConversationId);

  // Auto-save messages to database with debouncing
  useEffect(() => {
    if (!activeConversationId || messages.length === 0) return;

    const timeoutId = setTimeout(async () => {
      try {
        await conversationDb.saveMessages(activeConversationId, messages);

        // Generate title for first message if needed
        if (messages.length >= 2 && !titleGenerated) {
          const currentConv = getActiveConversation();
          if (currentConv?.title === 'New Conversation') {
            setTitleGenerated(true);
            try {
              const generatedTitle = await generateTitle(messages[0].content);
              await conversationDb.updateConversation(activeConversationId, { title: generatedTitle });
              updateConversation(activeConversationId, { title: generatedTitle });
            } catch (error) {
              console.error('Error generating title:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error auto-saving messages:', error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [messages, activeConversationId, titleGenerated, getActiveConversation, updateConversation, setTitleGenerated]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    // Check if user can send messages based on subscription limits
    if (!canSendMessage()) {
      const remainingMessages = limits.maxDailyMessages - (usage?.messages_sent_today || 0);
      toast({
        title: "Message Limit Reached",
        description: `You've reached your daily message limit of ${limits.maxDailyMessages} for ${limits.subscriptionTier} plan. ${remainingMessages > 0 ? `You have ${remainingMessages} messages remaining.` : 'Upgrade your subscription to send more messages.'}`,
        variant: "destructive"
      });
      return;
    }

    // Create new conversation if none is active
    let currentConvId = activeConversationId;
    if (!currentConvId) {
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
    
    // Add user message immediately
    addMessage(userMessage);
    setInput('');
    
    // Set loading state but NOT streaming yet
    setLoading(true);
    setStreamingMessageId(undefined);

    // Save user message immediately to database
    try {
      await conversationDb.saveMessage(currentConvId, userMessage);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    try {
      const data = await sendMessageToAPI(trimmedInput);
      const assistantMessage = createAssistantMessage(data.answer, data.citations);
      
      // Stop loading and start streaming
      setLoading(false);
      addMessage(assistantMessage);
      setStreamingMessageId(assistantMessage.id);

      // Save assistant message to database
      try {
        await conversationDb.saveMessage(currentConvId, assistantMessage);
      } catch (error) {
        console.error('Error saving assistant message:', error);
      }

      // Increment message count after successful API call
      await incrementMessageCount();

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage = createErrorMessage();
      addMessage(errorMessage);
      
      // Clear all loading states on error
      setLoading(false);
      setStreamingMessageId(undefined);
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

  const resetChat = () => {
    resetMessages();
    setInput('');
    setExpandedCitations({});
    setStreamingMessageId(undefined);
    setLoading(false);
  };

  return {
    messages,
    input,
    loading,
    streamingMessageId,
    expandedCitations,
    setInput,
    sendMessage,
    toggleCitations,
    handleSuggestionClick,
    resetChat,
    // Expose limits for UI components
    canSendMessage: canSendMessage(),
    limits,
    usage
  };
};
