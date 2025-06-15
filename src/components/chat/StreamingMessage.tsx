
import React, { useState, useEffect } from 'react';
import { Message } from '@/types/chat';

interface StreamingMessageProps {
  message: Message;
  isStreaming?: boolean;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ message, isStreaming = false }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isStreaming && message.content) {
      if (currentIndex < message.content.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(prev => prev + message.content[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 30); // Slightly slower for better readability

        return () => clearTimeout(timer);
      }
    } else {
      // If not streaming, show full content immediately
      setDisplayedContent(message.content);
      setCurrentIndex(message.content.length);
    }
  }, [message.content, currentIndex, isStreaming]);

  // Reset when message changes
  useEffect(() => {
    if (isStreaming) {
      setDisplayedContent('');
      setCurrentIndex(0);
    }
  }, [message.id, isStreaming]);

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
        <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
        {citationElements.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">References</h4>
            <div className="space-y-1">
              {citationElements}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl px-5 py-4 shadow-sm bg-white border border-gray-200 text-gray-900">
      <div className="flex items-start">
        <div className="flex-1">
          {formatMessageWithCitations(displayedContent, message.citations)}
        </div>
        {isStreaming && currentIndex < message.content.length && (
          <div className="ml-1 mt-1">
            <div className="w-0.5 h-4 bg-orange-500 animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamingMessage;
