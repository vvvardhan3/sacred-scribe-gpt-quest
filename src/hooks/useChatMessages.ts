
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
        console.log('Auto-saving messages to database');
        await conversationDb.saveMessages(activeConversationId, messages);

        // Generate title for first message if needed
        if (messages.length >= 2 && !titleGenerated) {
          const currentConv = getActiveConversation();
          if (currentConv?.title === 'New Conversation') {
            console.log('Generating title for first message');
            setTitleGenerated(true);
            try {
              const generatedTitle = await generateTitle(messages[0].content);
              console.log('Generated title:', generatedTitle);
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

    // Clear any existing streaming state
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

      console.log('API response received, creating assistant message:', assistantMessage.id);
      
      // Add message first, then start streaming
      addMessage(assistantMessage);
      
      // Small delay to ensure message is rendered before starting streaming
      setTimeout(() => {
        console.log('Starting streaming for message:', assistantMessage.id);
        setStreamingMessageId(assistantMessage.id);
        
        // Stop streaming after calculated duration
        const streamingDuration = Math.max(2000, data.answer.length * 30);
        console.log('Streaming will stop after:', streamingDuration + 'ms');
        
        setTimeout(() => {
          console.log('Stopping streaming for message:', assistantMessage.id);
          setStreamingMessageId(undefined);
        }, streamingDuration);
      }, 100);

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
      
      // Clear streaming state on error
      setStreamingMessageId(undefined);
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
