
import React from 'react';
import { CopyButton } from './CopyButton';
import { LanguageDisplay } from './LanguageDisplay';
import { Loader } from './Loader';
import type { TranslationResult } from '../types';

interface TranslatorCardProps {
  inputText: string;
  setInputText: (text: string) => void;
  translationResult: TranslationResult | null;
  isLoading: boolean;
  error: string | null;
  onTranslate: (text: string) => void;
  cooldownTime: number;
}

export const TranslatorCard: React.FC<TranslatorCardProps> = ({
  inputText,
  setInputText,
  translationResult,
  isLoading,
  error,
  onTranslate,
  cooldownTime,
}) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onTranslate(inputText);
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-sm border border-gray-200 dark:border-cyan-500/30 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-cyan-500/10 p-6 md:p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Text to Translate
          </label>
          <textarea
            id="inputText"
            rows={5}
            className="w-full p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 transition-colors duration-200"
            placeholder="Hello world, how are you today?"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between">
            <LanguageDisplay 
                language={translationResult?.detectedLanguage ?? null} 
                isLoading={isLoading} 
            />
            <button
                type="submit"
                disabled={isLoading || !inputText.trim() || cooldownTime > 0}
                className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all duration-200 transform hover:scale-105"
            >
                {isLoading ? 'Translating...' : cooldownTime > 0 ? `Wait (${cooldownTime}s)` : 'Tr4nsl4t3'}
            </button>
        </div>
      </form>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      <div>
        <div className="flex items-center justify-between mb-2">
            <label htmlFor="outputText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                1337 Sp34k Output
            </label>
            {translationResult && !isLoading && (
                <CopyButton textToCopy={translationResult.leetTranslation} />
            )}
        </div>
        <div className="w-full p-3 h-36 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg overflow-y-auto relative font-mono">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader />
                </div>
            )}
            {error && !isLoading && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-red-500 text-center">{error}</p>
                </div>
            )}
            {!isLoading && !error && translationResult && (
                <p className="whitespace-pre-wrap">{translationResult.leetTranslation}</p>
            )}
             {!isLoading && !error && !translationResult && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 dark:text-gray-500">Your translation will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
