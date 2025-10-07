
import React from 'react';

interface FooterProps {
    onViewLogs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewLogs }) => {
  return (
    <footer className="text-center py-4 px-6 text-sm text-gray-500">
      <p>Powered by Google Gemini. Built for the modern web.</p>
       <button 
        onClick={onViewLogs}
        className="mt-2 text-xs text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 underline transition-colors"
      >
          View Application Logs
      </button>
    </footer>
  );
};
