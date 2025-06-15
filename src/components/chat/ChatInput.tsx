
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  loading,
  onInputChange,
  onSendMessage
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-6 border-t border-gray-100">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask about Hindu scriptures..."
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="min-h-[60px] pr-12 resize-none border-gray-300 focus:border-gray-400 focus:ring-gray-400 rounded-xl"
          rows={1}
        />
        <Button 
          onClick={onSendMessage} 
          disabled={loading || !input.trim()}
          size="sm"
          className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-gray-900 hover:bg-gray-800"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        HinduGPT can make mistakes. Consider checking important information.
      </div>
    </div>
  );
};

export default ChatInput;
