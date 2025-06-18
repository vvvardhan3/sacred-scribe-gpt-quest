
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Lock } from 'lucide-react';

interface ChatInputProps {
  input: string;
  loading: boolean;
  disabled?: boolean;
  disabledMessage?: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  loading,
  disabled = false,
  disabledMessage,
  onInputChange,
  onSendMessage
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading && !disabled) {
        onSendMessage();
      }
    }
  };

  const handleSend = () => {
    if (input.trim() && !loading && !disabled) {
      onSendMessage();
    }
  };

  const isInputDisabled = loading || disabled;

  return (
    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-4xl mx-auto">
        {disabled && disabledMessage && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <Lock className="w-4 h-4" />
            <span>{disabledMessage}</span>
          </div>
        )}
        
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={disabled ? "Daily message limit reached" : "Ask about Hindu scriptures..."}
            onKeyDown={handleKeyDown}
            disabled={isInputDisabled}
            className={`min-h-[60px] max-h-[120px] pr-14 resize-none border-gray-300 focus:border-orange-400 focus:ring-orange-400 rounded-xl bg-white shadow-sm text-base overflow-hidden ${
              disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
            }`}
            rows={1}
          />
          <Button 
            onClick={handleSend} 
            disabled={isInputDisabled || !input.trim()}
            size="sm"
            className={`absolute bottom-3 right-3 h-9 w-9 p-0 shadow-sm ${
              disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {disabled ? <Lock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-xs text-gray-500 text-center mt-3">
          HinduGPT can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
