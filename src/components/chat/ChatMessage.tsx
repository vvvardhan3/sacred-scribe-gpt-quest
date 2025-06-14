
import React from 'react';
import { Message } from '@/types/chat';

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
  // Function to generate online links for citations
  const getCitationLink = (citation: string) => {
    const lowerCitation = citation.toLowerCase();
    
    // Bhagavad Gita references
    if (lowerCitation.includes('bhagavad gita') || lowerCitation.includes('gita')) {
      const chapterMatch = citation.match(/(\d+)\.(\d+)/);
      if (chapterMatch) {
        return `https://www.holy-bhagavad-gita.org/chapter/${chapterMatch[1]}/verse/${chapterMatch[2]}`;
      }
      return 'https://www.holy-bhagavad-gita.org/';
    }
    
    // Upanishads
    if (lowerCitation.includes('upanishad')) {
      if (lowerCitation.includes('brihadaranyaka')) {
        return 'https://www.sacred-texts.com/hin/sbe15/index.htm';
      }
      if (lowerCitation.includes('chandogya')) {
        return 'https://www.sacred-texts.com/hin/sbe01/index.htm';
      }
      if (lowerCitation.includes('katha')) {
        return 'https://www.sacred-texts.com/hin/sbe15/sbe15054.htm';
      }
      if (lowerCitation.includes('mandukya')) {
        return 'https://www.sacred-texts.com/hin/sbe15/sbe15071.htm';
      }
      return 'https://www.sacred-texts.com/hin/upan/index.htm';
    }
    
    // Ramayana
    if (lowerCitation.includes('ramayana')) {
      return 'https://www.valmiki.iitk.ac.in/';
    }
    
    // Mahabharata
    if (lowerCitation.includes('mahabharata')) {
      return 'https://www.sacred-texts.com/hin/maha/index.htm';
    }
    
    // Puranas
    if (lowerCitation.includes('purana')) {
      if (lowerCitation.includes('vishnu')) {
        return 'https://www.sacred-texts.com/hin/vp/index.htm';
      }
      if (lowerCitation.includes('shiva')) {
        return 'https://www.sacred-texts.com/hin/psa/index.htm';
      }
      return 'https://www.sacred-texts.com/hin/index.htm#puranas';
    }
    
    // Vedas
    if (lowerCitation.includes('veda') || lowerCitation.includes('rig') || lowerCitation.includes('sama') || lowerCitation.includes('yajur') || lowerCitation.includes('atharva')) {
      return 'https://www.sacred-texts.com/hin/rigveda/index.htm';
    }
    
    // Default to Sacred Texts Hindu section
    return 'https://www.sacred-texts.com/hin/index.htm';
  };

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
                    <div key={index} className="mb-2 last:mb-0 leading-relaxed">
                      <span className="font-medium">#{index + 1}:</span> {citation}
                      <br />
                      <a 
                        href={getCitationLink(citation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-xs mt-1 inline-block"
                      >
                        Read online →
                      </a>
                    </div>
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
