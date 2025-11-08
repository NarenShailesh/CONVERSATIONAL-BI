import React from 'react';
import { BotIcon } from './Icons';

type Page = 'home' | 'analyze' | 'history';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const NavLink: React.FC<{page: Page, children: React.ReactNode}> = ({ page, children }) => {
    const isActive = currentPage === page;
    const tooltips: Record<Page, string> = {
        home: "Go to the Home page",
        analyze: "Go to the Analyze page",
        history: "View your chat history"
    };

    return (
        <button 
            onClick={() => onNavigate(page)}
            title={tooltips[page]}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
        >
            {children}
        </button>
    )
  }

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <BotIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Conversational BI Assistant</h1>
          <p className="text-sm text-gray-400">Powered by Gemini</p>
        </div>
      </div>
      <nav className="flex items-center gap-2">
        <NavLink page="home">Home</NavLink>
        <NavLink page="analyze">Analyze</NavLink>
        <NavLink page="history">History</NavLink>
      </nav>
    </header>
  );
};