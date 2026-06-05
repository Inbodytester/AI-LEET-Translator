import React from 'react';
import { TrashIcon } from './icons/TrashIcon';
import type { HistoryEntry } from '../types';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onItemClick: (entry: HistoryEntry) => void;
  onClear: () => void;
}

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
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onItemClick(entry);
                              }
                            }}
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