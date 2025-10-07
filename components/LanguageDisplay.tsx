import React from 'react';

interface LanguageDisplayProps {
  language: string | null;
  isLoading: boolean;
}

export const LanguageDisplay: React.FC<LanguageDisplayProps> = ({ language, isLoading }) => {
  if (!language && !isLoading) return null;

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 px-3 py-1.5 rounded-md min-w-[180px] text-center">
      {isLoading && !language && <span>Detecting Language...</span>}
      {language && <span>Detected: <span className="font-bold text-cyan-500 dark:text-cyan-400">{language}</span></span>}
    </div>
  );
};