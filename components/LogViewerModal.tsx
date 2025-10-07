
import React from 'react';
import type { LogEntry } from '../types';

interface LogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const LogViewerModal: React.FC<LogViewerModalProps> = ({ isOpen, onClose, logs, onClearLogs }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="log-viewer-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="log-viewer-title" className="text-xl font-bold text-cyan-500 dark:text-cyan-400">Application Logs</h2>
          <div className="flex items-center space-x-2">
            <button
                onClick={onClearLogs}
                className="flex items-center text-sm px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
                aria-label="Clear all logs"
            >
                <TrashIcon />
                Clear Logs
            </button>
            <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                aria-label="Close log viewer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        </header>
        <main className="flex-grow p-4 overflow-y-auto">
            {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <p>No logs recorded yet.</p>
                </div>
            ) : (
                <ul className="space-y-2 font-mono text-sm">
                    {logs.map((log, index) => (
                        <li key={`${log.timestamp}-${index}`} className="p-2 rounded-md bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-gray-400">{new Date(log.timestamp).toISOString()}</span>
                                <span className={`font-bold px-2 py-0.5 rounded text-xs ${log.level === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                                    {log.level.toUpperCase()}
                                </span>
                            </div>
                            <p className="mt-1 text-gray-700 dark:text-gray-300">{log.message}</p>
                            {log.data && (
                                <pre className="mt-1 p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
                                    {JSON.stringify(log.data, null, 2)}
                                </pre>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </main>
      </div>
    </div>
  );
};
