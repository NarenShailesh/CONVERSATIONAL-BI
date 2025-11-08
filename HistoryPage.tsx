import React, { useEffect, useState } from 'react';
import { ChatSession } from './types';
import { ChatMessage } from './components/ChatMessage';

export const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');
        // Sort sessions by date, newest first
        storedHistory.sort((a: ChatSession, b: ChatSession) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setHistory(storedHistory);
        if (storedHistory.length > 0) {
            setSelectedSession(storedHistory[0]);
        }
    }, []);

    if (history.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">No History Found</h2>
                    <p className="mt-2 text-gray-400">
                        Complete a chat on the 'Analyze' page to see your history here.
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex h-full">
            <aside className="w-1/3 max-w-sm h-full overflow-y-auto border-r border-gray-700">
                <div className="p-4">
                    <h2 className="text-xl font-bold">Chat History</h2>
                </div>
                <ul>
                    {history.map(session => (
                        <li key={session.id}>
                            <button 
                                onClick={() => setSelectedSession(session)}
                                className={`w-full text-left p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors ${selectedSession?.id === session.id ? 'bg-gray-700' : ''}`}
                            >
                                <p className="font-semibold truncate">{session.tableName}</p>
                                <p className="text-sm text-gray-400">{new Date(session.startTime).toLocaleString()}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {selectedSession ? (
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="mb-6 pb-4 border-b border-gray-700">
                            <h3 className="text-2xl font-bold">Session Details</h3>
                            <p className="text-gray-400">
                                Analyzed <span className="font-mono bg-gray-700 px-2 py-1 rounded">{selectedSession.tableName}</span> on {new Date(selectedSession.startTime).toLocaleString()}
                            </p>
                        </div>
                        {selectedSession.messages.map(msg => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Select a session to view the conversation.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
