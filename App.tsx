import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './HomePage';
import { AnalyzePage } from './AnalyzePage';
import { HistoryPage } from './HistoryPage';

type Page = 'home' | 'analyze' | 'history';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');

  const renderPage = () => {
    switch (page) {
      case 'analyze':
        return <AnalyzePage />;
      case 'history':
        return <HistoryPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header currentPage={page} onNavigate={setPage} />
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
