
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicIcon } from './Icons';

interface ChatInputProps {
  onSend: (query: string) => void;
  isLoading: boolean;
}

// Declare the SpeechRecognition types for window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setQuery(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setQuery('');
    }
    setIsListening(!isListening);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSend(query);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-xl p-2">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening..." : "Ask about your data..."}
        className="flex-1 bg-transparent resize-none outline-none p-2 text-gray-200 placeholder-gray-400 max-h-32"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={handleMicClick}
        disabled={isLoading}
        title="Use voice input"
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white' : 'hover:bg-gray-700'}`}
      >
        <MicIcon />
      </button>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        title="Send message"
        className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          <SendIcon />
        )}
      </button>
    </form>
  );
};