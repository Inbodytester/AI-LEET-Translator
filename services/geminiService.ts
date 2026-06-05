import type { TranslationResult } from '../types';

export const translateToLeetSpeak = async (text: string): Promise<TranslationResult> => {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(typeof data?.error === 'string' ? data.error : 'Translation failed.');
  }

  return data as TranslationResult;
};