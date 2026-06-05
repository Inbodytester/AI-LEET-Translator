import React, { useState, useCallback } from 'react';

interface CopyButtonProps {
  textToCopy: string;
}

const ClipboardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopy = useCallback(async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 flex items-center space-x-2 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 ${
        isCopied
          ? 'bg-green-600 text-white focus:ring-green-500'
          : copyError
            ? 'bg-red-600 text-white focus:ring-red-500'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 focus:ring-cyan-500'
      }`}
      aria-label={copyError ? 'Copy failed' : isCopied ? 'Copied to clipboard' : 'Copy translation to clipboard'}
    >
      {isCopied ? <CheckIcon /> : <ClipboardIcon />}
      <span>{isCopied ? 'Copied!' : copyError ? 'Failed' : 'Copy'}</span>
    </button>
  );
};