import React from 'react';
import { BotIcon } from './components/Icons';

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-gray-200">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Conversational BI Assistant
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          Your personal data analyst. Upload a file, ask questions in natural language, and get insights with dynamic visualizations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-indigo-400 mb-2">1. Upload Your Data</h3>
          <p className="text-gray-300">
            Navigate to the 'Analyze' page and upload your CSV file. Your data is processed securely in the browser.
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-indigo-400 mb-2">2. Ask Anything</h3>
          <p className="text-gray-300">
            Use the chat interface to ask questions about your data, like "What were the total sales by region?". Use your voice or text.
          </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-indigo-400 mb-2">3. Get Visual Insights</h3>
          <p className="text-gray-300">
            The assistant analyzes your query and data to generate interactive charts and summaries on the fly.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Technology Stack</h2>
        <div className="flex justify-center items-center gap-6 flex-wrap">
            <span className="bg-indigo-900/50 text-indigo-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded">React</span>
            <span className="bg-gray-700 text-gray-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded">TypeScript</span>
            <span className="bg-green-900/50 text-green-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded">Gemini API</span>
            <span className="bg-blue-900/50 text-blue-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded">Plotly.js</span>
            <span className="bg-purple-900/50 text-purple-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded">Web Speech API</span>
        </div>
      </div>
    </div>
  );
};
