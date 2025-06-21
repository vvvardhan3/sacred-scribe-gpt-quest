
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
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
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

  // Auto-save messages to database with improved error handling
  useEffect(() => {
    if (!activeConversationId || messages.length === 0 || savingMessage) return;

    const timeoutId = setTimeout(async () => {
      setSavingMessage(true);
      try {
        // Save messages with improved error handling
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
              // Don't throw - title generation is not critical
            }
          }
        }
      } catch (error) {
        console.error('Error auto-saving messages:', error);
        // Don't show error to user for auto-save failures unless it's critical
        if (error && typeof error === 'object' && 'code' in error && error.code !== '23505') {
          toast({
            title: "Save Warning",
            description: "There was an issue saving your conversation. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      } finally {
        setSavingMessage(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [messages, activeConversationId, titleGenerated, getActiveConversation, updateConversation, setTitleGenerated, savingMessage, toast]);

  // Calculate remaining messages
  const getRemainingMessages = () => {
    if (!usage || limits.maxDailyMessages === Infinity) return Infinity;
    return Math.max(0, limits.maxDailyMessages - usage.messages_sent_today);
  };

  // Check if user should see warning (when 3 or fewer messages remain)
  const shouldShowWarning = () => {
    const remaining = getRemainingMessages();
    return remaining <= 3 && remaining > 0 && limits.maxDailyMessages !== Infinity;
  };

  // Check if user is at limit
  const isAtLimit = () => {
    return !canSendMessage();
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    console.log('Attempting to send message:', trimmedInput);

    // Check if user can send messages based on subscription limits
    if (!canSendMessage()) {
      const remainingMessages = getRemainingMessages();
      toast({
        title: "Message Limit Reached",
        description: `You've reached your daily message limit of ${limits.maxDailyMessages} for ${limits.subscriptionTier} plan. ${remainingMessages > 0 ? `You have ${remainingMessages} messages remaining.` : 'Upgrade your subscription to send more messages.'}`,
        variant: "destructive"
      });
      return;
    }

    // Show warning modal if user is close to limit
    if (shouldShowWarning()) {
      setShowWarningModal(true);
      return;
    }

    await executeSendMessage();
  };

  const executeSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    console.log('Executing send message:', trimmedInput);

    // Create new conversation if none is active
    let currentConvId = activeConversationId;
    if (!currentConvId) {
      console.log('Creating new conversation...');
      try {
        currentConvId = await createNewConversation();
        if (!currentConvId) {
          console.error('Failed to create new conversation');
          toast({
            title: "Error",
            description: "Failed to create new conversation. Please try again.",
            variant: "destructive"
          });
          return;
        }
        console.log('New conversation created:', currentConvId);
      } catch (error) {
        console.error('Error creating conversation:', error);
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
      console.log('User message saved to database');
    } catch (error) {
      console.error('Error saving user message:', error);
      // Continue anyway - message is in UI state
    }

    try {
      console.log('Sending message to API...');
      const data = await sendMessageToAPI(trimmedInput);
      console.log('API response received:', data);
      
      const assistantMessage = createAssistantMessage(data.answer, data.citations);
      
      // Stop loading and start streaming
      setLoading(false);
      addMessage(assistantMessage);
      setStreamingMessageId(assistantMessage.id);

      // Save assistant message to database
      try {
        await conversationDb.saveMessage(currentConvId, assistantMessage);
        console.log('Assistant message saved to database');
      } catch (error) {
        console.error('Error saving assistant message:', error);
        // Continue anyway - message is in UI state
      }

      // Increment message count after successful API call
      try {
        await incrementMessageCount();
        console.log('Message count incremented');
      } catch (error) {
        console.error('Error incrementing message count:', error);
        // Continue anyway - this is not critical
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Stop loading state
      setLoading(false);
      setStreamingMessageId(undefined);
      
      // Show more specific error message
      const errorMessage = error.message || 'Failed to send message. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      const errorMsg = createErrorMessage();
      addMessage(errorMsg);

      // Save error message to database
      try {
        await conversationDb.saveMessage(currentConvId, errorMsg);
      } catch (saveError) {
        console.error('Error saving error message:', saveError);
      }
    }
  };

  const handleWarningModalContinue = () => {
    setShowWarningModal(false);
    executeSendMessage();
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
    setShowWarningModal(false);
  };

  return {
    messages,
    input,
    loading,
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
    // Expose limits for UI components
    canSendMessage: canSendMessage(),
    isAtLimit: isAtLimit(),
    remainingMessages: getRemainingMessages(),
    limits,
    usage
  };
};
