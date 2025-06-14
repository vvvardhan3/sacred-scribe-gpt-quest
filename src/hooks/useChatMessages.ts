
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: Date;
}

export const useChatMessages = (
  activeConversationId: string | null,
  getActiveConversation: () => any,
  updateConversation: (id: string, updates: any) => void,
  createNewConversation: () => string
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<{ [key: string]: boolean }>({});
  const [titleGenerated, setTitleGenerated] = useState(false);
  const { toast } = useToast();

  // Load messages when active conversation changes
  useEffect(() => {
    console.log('Loading messages for conversation:', activeConversationId);
    const activeConv = getActiveConversation();
    if (activeConv && activeConv.messages) {
      const messagesWithDates = activeConv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      console.log('Loaded messages:', messagesWithDates);
      setMessages(messagesWithDates);
      setTitleGenerated(!!activeConv.title && activeConv.title !== 'New Conversation');
    } else {
      console.log('No active conversation or no messages, resetting');
      setMessages([]);
      setTitleGenerated(false);
    }
  }, [activeConversationId]);

  const generateTitle = async (message: string): Promise<string> => {
    try {
      console.log('Generating AI title for:', message);
      const { data, error } = await supabase.functions.invoke('generate-chat-title', {
        body: { message }
      });

      if (error) {
        console.error('Title generation error:', error);
        throw error;
      }

      console.log('Generated title:', data.title);
      return data.title;
    } catch (error) {
      console.error('Failed to generate AI title, using fallback:', error);
      // Fallback to simple truncation
      return message.slice(0, 30) + (message.length > 30 ? '...' : '');
    }
  };

  // Save messages to active conversation
  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      console.log('Saving messages to conversation:', activeConversationId, messages);
      
      // Filter only user messages for sidebar display
      const userMessages = messages.filter(msg => msg.role === 'user');
      const lastUserMessage = userMessages[userMessages.length - 1];
      
      const currentConv = getActiveConversation();
      let title = currentConv?.title || 'New Conversation';
      
      // Generate AI title only for the first user message and only once
      if (messages.length >= 1 && messages[0].role === 'user' && !titleGenerated) {
        setTitleGenerated(true);
        generateTitle(messages[0].content).then(generatedTitle => {
          updateConversation(activeConversationId, {
            messages,
            lastMessage: lastUserMessage ? lastUserMessage.content.slice(0, 100) : 'No messages yet',
            title: generatedTitle
          });
        });
        return;
      }
      
      updateConversation(activeConversationId, {
        messages,
        lastMessage: lastUserMessage ? lastUserMessage.content.slice(0, 100) : 'No messages yet',
        title
      });
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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    console.log('Adding user message:', userMessage);
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      console.log('Updated messages after user message:', newMessages);
      return newMessages;
    });
    
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

      console.log('Received response:', data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        citations: data.citations || [],
        timestamp: new Date()
      };

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

  const resetChat = () => {
    console.log('Resetting chat');
    setMessages([]);
    setInput('');
    setExpandedCitations({});
    setTitleGenerated(false);
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
