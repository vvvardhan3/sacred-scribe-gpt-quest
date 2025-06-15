
import React from 'react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
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

  // Function to format message content with inline citations
  const formatMessageWithCitations = (content: string, citations?: string[]) => {
    if (!citations || citations.length === 0) {
      return <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>;
    }

    // Split content into paragraphs and process each one
    const paragraphs = content.split('\n\n');
    
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          
          return (
            <div key={index}>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{paragraph}</p>
              
              {/* Show relevant citations after each paragraph if this is the last paragraph or every few paragraphs */}
              {(index === paragraphs.length - 1) && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-medium text-gray-600 mb-2">References:</div>
                  {citations.map((citation, citIndex) => (
                    <div key={citIndex} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3 py-1">
                      <span className="font-medium text-gray-800">#{citIndex + 1}</span> {citation}
                      <br />
                      <a 
                        href={getCitationLink(citation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors mt-1"
                      >
                        Read online →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start space-x-4 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Message Content */}
        <div className="flex flex-col space-y-2">
          <div className={`rounded-2xl px-5 py-4 shadow-sm ${
            message.role === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}>
            {formatMessageWithCitations(message.content, message.citations)}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs px-1 ${
            message.role === 'user' ? 'text-right text-gray-500' : 'text-left text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
