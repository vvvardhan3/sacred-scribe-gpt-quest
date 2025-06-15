
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';

interface StreamingMessageProps {
  message: Message;
  isStreaming?: boolean;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ message, isStreaming = false }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isStreamingRef = useRef(false);

  // Initialize content based on streaming state
  useEffect(() => {
    console.log('StreamingMessage: Effect triggered', { 
      messageId: message.id, 
      isStreaming, 
      contentLength: message.content.length,
      currentStreaming: isStreamingRef.current
    });

    // Clear any existing intervals first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isStreaming && !isStreamingRef.current) {
      console.log('StreamingMessage: Starting new streaming session for', message.id);
      isStreamingRef.current = true;
      setDisplayedContent('');
      setCurrentIndex(0);
      setIsComplete(false);
      
      // Start streaming immediately
      startStreaming();
    } else if (!isStreaming) {
      console.log('StreamingMessage: Showing complete content immediately');
      isStreamingRef.current = false;
      setDisplayedContent(message.content);
      setCurrentIndex(message.content.length);
      setIsComplete(true);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [message.id, isStreaming]);

  const startStreaming = () => {
    if (!isStreamingRef.current || intervalRef.current) return;

    const streamNextChar = () => {
      setCurrentIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        
        if (newIndex <= message.content.length) {
          setDisplayedContent(message.content.substring(0, newIndex));
          
          if (newIndex < message.content.length && isStreamingRef.current) {
            intervalRef.current = setTimeout(streamNextChar, 30);
          } else {
            console.log('StreamingMessage: Streaming complete for', message.id);
            setIsComplete(true);
            isStreamingRef.current = false;
            if (intervalRef.current) {
              clearTimeout(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
        
        return newIndex;
      });
    };

    streamNextChar();
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

  return (
    <div className="rounded-2xl px-5 py-4 shadow-sm bg-white border border-gray-200 text-gray-900">
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {displayedContent}
            {isStreaming && !isComplete && (
              <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse" />
            )}
          </p>
          
          {/* Only show references after streaming is complete or when not streaming */}
          {(isComplete || !isStreaming) && message.citations && message.citations.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">References</h4>
              <div className="space-y-1">
                {message.citations.map((citation, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <span className="font-medium">#{index + 1}</span> {citation}{' '}
                    <a 
                      href={getCitationLink(citation)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Read online
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingMessage;
