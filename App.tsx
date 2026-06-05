
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HistoryPanel } from './components/HistoryPanel';
import { TranslatorCard } from './components/TranslatorCard';
import { LogViewerModal } from './components/LogViewerModal';
import { translateToLeetSpeak } from './services/geminiService';
import * as logService from './services/logService';
import type { HistoryEntry, Theme, TranslationResult, LogEntry } from './types';

const isValidTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (isValidTheme(savedTheme)) return savedTheme;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    return prefersDark ? 'dark' : 'light';
  });

  const [inputText, setInputText] = useState<string>('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const savedHistory = localStorage.getItem('translationHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      return [];
    }
  });
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const isCooldownActive = cooldownTime > 0;

  // State for logging
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const refreshLogs = useCallback(() => {
    setLogs(logService.getLogs());
  }, []);

  useEffect(() => {
    refreshLogs();
    logService.addLog('info', 'Application session started.');
    refreshLogs();
  }, [refreshLogs]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('translationHistory', JSON.stringify(history));
  }, [history]);
  
  useEffect(() => {
    if (!isCooldownActive) return;

    const intervalId = window.setInterval(() => {
      setCooldownTime((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isCooldownActive]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        logService.addLog('info', `Theme changed to ${newTheme}.`);
        refreshLogs();
        return newTheme;
    });
  };
  
  const handleTranslate = async (text: string) => {
    if (!text.trim() || isLoading || cooldownTime > 0) return;

    setIsLoading(true);
    setError(null);
    setTranslationResult(null);
    setInputText(text);
    logService.addLog('info', 'Translation started.', { text: text.length > 50 ? text.substring(0, 50) + '...' : text });
    refreshLogs();

    try {
      const result = await translateToLeetSpeak(text);
      setTranslationResult(result);
      
      const newHistoryEntry: HistoryEntry = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalText: text,
      };
      setHistory(prevHistory => [newHistoryEntry, ...prevHistory.slice(0, 49)]);
      logService.addLog('info', 'Translation successful.', { detectedLanguage: result.detectedLanguage });
      setCooldownTime(10);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      logService.addLog('error', 'Translation failed.', { error: errorMessage });
    } finally {
      setIsLoading(false);
      refreshLogs();
    }
  };
  
  const handleHistoryItemClick = useCallback((entry: HistoryEntry) => {
    setInputText(entry.originalText);
    setTranslationResult({
      detectedLanguage: entry.detectedLanguage,
      leetTranslation: entry.leetTranslation,
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logService.addLog('info', 'History item loaded from history.', { id: entry.id });
    refreshLogs();
  }, [refreshLogs]);

  const handleClearHistory = () => {
      setHistory([]);
      logService.addLog('info', 'Translation history cleared.');
      refreshLogs();
  };

  const handleViewLogs = () => setIsLogModalOpen(true);
  const handleCloseLogs = () => setIsLogModalOpen(false);
  const handleClearLogs = () => {
    logService.clearLogs();
    logService.addLog('info', 'Application logs cleared.');
    refreshLogs();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TranslatorCard
              inputText={inputText}
              setInputText={setInputText}
              translationResult={translationResult}
              isLoading={isLoading}
              error={error}
              onTranslate={handleTranslate}
              cooldownTime={cooldownTime}
            />
          </div>
          <div className="lg:col-span-1 h-[550px] lg:h-auto">
            <HistoryPanel
              history={history}
              onItemClick={handleHistoryItemClick}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </main>
      <Footer onViewLogs={handleViewLogs} />
      <LogViewerModal 
        isOpen={isLogModalOpen}
        onClose={handleCloseLogs}
        logs={logs}
        onClearLogs={handleClearLogs}
      />
    </div>
  );
};

export default App;
