
export interface TranslationResult {
  detectedLanguage: string;
  leetTranslation: string;
}

export interface HistoryEntry extends TranslationResult {
  id: string;
  timestamp: number;
  originalText: string;
}

export type Theme = 'light' | 'dark';

export interface LogEntry {
  timestamp: number;
  level: 'info' | 'error';
  message: string;
  data?: Record<string, any>;
}
