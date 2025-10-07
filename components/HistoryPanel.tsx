import React from 'react';
import type { HistoryEntry } from '../types';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onItemClick: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onItemClick, onClear }) => {
    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-cyan-500/30 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-cyan-500/10 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-500 dark:text-cyan-400">History</h2>
                {history.length > 0 && (
                    <button 
                        onClick={onClear} 
                        className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Clear translation history"
                    >
                        <TrashIcon />
                        Clear
                    </button>
                )}
            </div>
            <div className="flex-grow overflow-y-auto -mr-3 pr-3 space-y-3">
                {history.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 dark:text-gray-500 text-center">Your past translations will appear here.</p>
                    </div>
                ) : (
                    history.map((entry) => (
                        <div 
                            key={entry.id} 
                            onClick={() => onItemClick(entry)}
                            className="p-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/70 border border-transparent hover:border-cyan-500/50 transition-all duration-200"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && onItemClick(entry)}
                            aria-label={`Select translation from ${new Date(entry.timestamp).toLocaleString()}`}
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={entry.originalText}>{entry.originalText}</p>
                            <p className="font-semibold text-cyan-600 dark:text-cyan-300 truncate" title={entry.leetTranslation}>{entry.leetTranslation}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};