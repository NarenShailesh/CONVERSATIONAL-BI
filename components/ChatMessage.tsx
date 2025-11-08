
import React from 'react';
import { Message } from '../types';
import { ChartDisplay } from './ChartDisplay';
import { UserIcon, BotIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-4 mb-6 ${!isBot && 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isBot ? 'bg-indigo-600' : 'bg-gray-600'}`}>
        {isBot ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`flex flex-col gap-2 p-4 rounded-xl max-w-2xl ${isBot ? 'bg-gray-800 rounded-tl-none' : 'bg-blue-800 rounded-tr-none'}`}>
        <p className="text-gray-200 whitespace-pre-wrap">{message.text}</p>
        {message.chartHtml && (
            <div className="bg-gray-700/50 rounded-lg p-2 mt-2 -mb-2 -mx-2">
                <div className="w-full h-80">
                    <ChartDisplay htmlContent={message.chartHtml} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
