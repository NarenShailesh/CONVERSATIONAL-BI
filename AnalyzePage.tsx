import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
// FIX: Import ColumnStats to provide a specific type for summary statistics.
import { Message, ChatSession, ColumnStats } from './types';
import { getChatResponse } from './services/geminiService';
import { BotIcon, FileIcon, UploadIcon, DownloadIcon, ChevronDownIcon } from './components/Icons';
import { parseCSV, convertToCSV, calculateSummaryStats } from './utils';

export const AnalyzePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<{ id: string; tableName: string | null }>({ id: '', tableName: null });
  const [error, setError] = useState<string | null>(null);
  // FIX: Use the specific `ColumnStats` type for summaryStats to resolve type errors
  // when accessing properties like stats.Count, stats.Mean, etc. in the JSX.
  const [summaryStats, setSummaryStats] = useState<Record<string, ColumnStats> | null>(null);
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check session storage to see if a file is already "loaded"
    const tableName = sessionStorage.getItem('current_table');
    const sessionDataString = sessionStorage.getItem('user_data');

    if (tableName && sessionDataString) {
      setSession({ id: `session_${Date.now()}`, tableName });
      setMessages([
        {
          id: Date.now(),
          sender: 'bot',
          text: `Welcome back! I'm ready to answer questions about your data from "${tableName}".`,
        },
      ]);
      // Recalculate stats on page load if data exists
      try {
        const { data } = JSON.parse(sessionDataString);
        const stats = calculateSummaryStats(data);
        setSummaryStats(stats);
      } catch (e) {
        console.error("Could not parse session data for stats", e);
      }
    }
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const inputElement = event.target;

    if (!file) return;

    setError(null);
    setSummaryStats(null); // Reset stats on new upload
    setIsLoading(true);
    
    // Reset input value to allow re-uploading the same file if it fails
    inputElement.value = '';

    // Add client-side validation for file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Invalid file type. Please select a CSV file.");
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string' || !text.trim()) {
          throw new Error("The selected file is empty or could not be read properly.");
        }

        const { headers, data } = parseCSV(text);

        if (headers.length === 0 || data.length === 0) {
          throw new Error("The CSV is not formatted correctly. Please ensure it has a header row and at least one data row.");
        }
        
        const stats = calculateSummaryStats(data);
        setSummaryStats(stats);

        const tableName = `user_data_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
        sessionStorage.setItem('current_table', tableName);
        sessionStorage.setItem('user_data', JSON.stringify({ headers, data }));

        const newSessionId = `session_${Date.now()}`;
        setSession({ id: newSessionId, tableName });
        setMessages([
          {
            id: Date.now(),
            sender: 'bot',
            text: `Great! Your file "${file.name}" has been loaded. The data has columns: ${headers.join(', ')}. What would you like to know?`,
          },
        ]);
      } catch (err: any) {
        setError(`Error processing "${file.name}": ${err.message}`);
        setSummaryStats(null);
        sessionStorage.clear(); // Ensure inconsistent state is not saved
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError(`Failed to read "${file.name}". The file may be corrupted or your browser may lack permission to access it.`);
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleSend = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    
    try {
      const history = newMessages.slice(-5);
      const botResponse = await getChatResponse(query, history);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        chartHtml: botResponse.chartHtml || undefined,
      };
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      saveSession(finalMessages);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSession = (finalMessages: Message[]) => {
      if (!session.id || !session.tableName) return;
      
      const chatSession: ChatSession = {
          id: session.id,
          tableName: session.tableName,
          startTime: new Date().toISOString(),
          messages: finalMessages
      }
      // Save/update session in localStorage
      const history = JSON.parse(localStorage.getItem('chat_history') || '[]');
      const existingIndex = history.findIndex((s: ChatSession) => s.id === session.id);
      if (existingIndex > -1) {
          history[existingIndex] = chatSession;
      } else {
          history.push(chatSession);
      }
      localStorage.setItem('chat_history', JSON.stringify(history));
  }

  const handleDownloadCSV = () => {
    const sessionDataString = sessionStorage.getItem('user_data');
    if (!session.tableName || !sessionDataString) {
      setError("No data available to download.");
      return;
    }

    try {
      const jsonData = JSON.parse(sessionDataString);
      const csvString = convertToCSV(jsonData);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      const downloadFileName = session.tableName.replace(/^user_data_/, '').replace(/_/g, '-') + '.csv';
      link.setAttribute("download", downloadFileName);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to prepare download. Data might be corrupted.");
      console.error("Download error:", err);
    }
  };


  if (!session.tableName) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto p-4">
        <div className="text-center">
            <FileIcon />
            <h2 className="mt-6 text-2xl font-bold text-white">Upload Your Data File</h2>
            <p className="mt-2 text-md text-gray-400">
            Upload a CSV file to begin your analysis. Your data is processed entirely in your browser and is not sent to any server.
            </p>
            <div className="mt-8">
            {/* FIX: Use UploadIcon in button and adjust styles for better UI. */}
            <label htmlFor="file-upload" className="relative cursor-pointer bg-indigo-600 text-white font-semibold rounded-md px-6 py-3 hover:bg-indigo-500 transition-colors inline-flex items-center gap-2">
                <UploadIcon />
                <span>{isLoading ? 'Processing...' : 'Select CSV File'}</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} disabled={isLoading} />
            </label>
            {error && <p className="mt-4 text-red-400">{error}</p>}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 z-5">
        <div className="max-w-4xl mx-auto p-3 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Current Dataset</p>
            <p className="font-semibold text-white truncate">{session.tableName.replace(/^user_data_/, '').replace(/_/g, ' ')}</p>
          </div>
          <button
            onClick={handleDownloadCSV}
            title="Download the current dataset as a CSV file"
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            <DownloadIcon />
            Download CSV
          </button>
        </div>
      </div>
      
      {summaryStats && (
        <div className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-4xl mx-auto px-3">
                <button
                    onClick={() => setIsSummaryVisible(!isSummaryVisible)}
                    className="w-full flex justify-between items-center py-3 text-left font-semibold text-white"
                >
                    <span>Data Summary</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isSummaryVisible ? 'rotate-180' : ''}`} />
                </button>
                {isSummaryVisible && (
                    <div className="pb-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-600">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Column</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Count</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mean</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Median</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Min</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Max</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {/* FIX: Explicitly type the [column, stats] tuple to resolve issue where TypeScript
                                    infers `stats` as `unknown`, causing property access errors. */}
                                {Object.entries(summaryStats).map(([column, stats]: [string, ColumnStats]) => (
                                    <tr key={column}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">{column}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{stats.Count}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{stats.Mean}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{stats.Median}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{stats.Min}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{stats.Max}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 animate-pulse">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <BotIcon />
                </div>
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>
      <footer className="sticky bottom-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
        <div className="max-w-4xl mx-auto p-4">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};