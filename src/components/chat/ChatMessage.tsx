
import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  expandedCitations: { [key: string]: boolean };
  onToggleCitations: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  expandedCitations, 
  onToggleCitations 
}) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.role === 'user' 
            ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
            : 'bg-gradient-to-br from-orange-500 to-red-500'
        }`}>
          <span className="text-white text-sm font-medium">
            {message.role === 'user' ? 'U' : 'AI'}
          </span>
        </div>
        
        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-3 ${
          message.role === 'user' 
            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' 
            : 'bg-gray-50 border border-gray-200 text-gray-900'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => onToggleCitations(message.id)}
                className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="mr-1">
                  {expandedCitations[message.id] ? '▼' : '▶'}
                </span>
                References ({message.citations.length})
              </button>
              
              {expandedCitations[message.id] && (
                <div className="mt-2 p-3 bg-white rounded-lg border text-xs text-gray-700">
                  {message.citations.map((citation, index) => (
                    <p key={index} className="mb-2 last:mb-0 leading-relaxed">
                      <span className="font-medium">#{index + 1}:</span> {citation}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
