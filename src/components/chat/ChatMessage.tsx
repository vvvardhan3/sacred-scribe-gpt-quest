
import React from 'react';
import { Message } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();

  // Function to get user initials
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    
    const displayName = user?.user_metadata?.display_name;
    if (displayName) {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    
    // Fallback to email
    const emailParts = user.email.split('@')[0];
    const nameParts = emailParts.split(/[._-]/);
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return emailParts.charAt(0).toUpperCase();
  };

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

    // Process content to add inline citations
    let processedContent = content;
    const citationElements: JSX.Element[] = [];

    citations.forEach((citation, index) => {
      const citationNumber = index + 1;
      citationElements.push(
        <div key={index} className="text-sm text-gray-600 mt-2">
          <span className="font-medium">#{citationNumber}</span> {citation}{' '}
          <a 
            href={getCitationLink(citation)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Read online
          </a>
        </div>
      );
    });

    return (
      <div>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{processedContent}</p>
        {citationElements.length > 0 && (
          <div className="mt-3 space-y-1">
            {citationElements}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex items-start space-x-4 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {message.role === 'user' ? (
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{getUserInitials()}</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">हिं</span>
            </div>
          )}
        </div>

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
