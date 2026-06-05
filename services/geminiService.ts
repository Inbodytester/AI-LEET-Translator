
import { GoogleGenAI, Type } from "@google/genai";
import type { TranslationResult } from '../types';

const MAX_INPUT_LENGTH = 4000;

const translationSchema = {
  type: Type.OBJECT,
  properties: {
    detectedLanguage: {
      type: Type.STRING,
      description: "The language detected from the user's input text (e.g., 'English', 'Spanish').",
    },
    leetTranslation: {
      type: Type.STRING,
      description: "The creative and accurate translation of the input text into advanced 1337 (leet) speak.",
    },
  },
  required: ['detectedLanguage', 'leetTranslation'],
};

const SYSTEM_INSTRUCTION = `You are an expert 1337 (leet) speak translator.
First, automatically identify the language of the user's text.
Then, translate it into advanced, creative, and authentic-sounding leet speak using numbers, symbols, and phonetic replacements.
Respond only in the requested JSON format.`;

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Translation service is not configured. Please set GEMINI_API_KEY.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

const mapApiError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('429') || message.toLowerCase().includes('quota')) {
    return 'Rate limit reached. Please wait a moment and try again.';
  }
  if (message.includes('401') || message.includes('403') || message.toLowerCase().includes('api key')) {
    return 'Invalid or missing API key. Check your GEMINI_API_KEY configuration.';
  }
  if (message.includes('503') || message.toLowerCase().includes('unavailable')) {
    return 'Translation service is temporarily unavailable. Please try again.';
  }
  return 'Failed to get a valid translation from the AI.';
};

export const translateToLeetSpeak = async (text: string): Promise<TranslationResult> => {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Please enter some text to translate.');
  }
  if (trimmed.length > MAX_INPUT_LENGTH) {
    throw new Error(`Text is too long. Maximum ${MAX_INPUT_LENGTH} characters.`);
  }

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
        { role: 'user', parts: [{ text: trimmed }] },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: translationSchema,
      },
    });

    const jsonString = response.text?.trim();
    if (!jsonString) {
      throw new Error('Empty response from AI.');
    }

    const parsedResult = JSON.parse(jsonString) as TranslationResult;

    if (!parsedResult.detectedLanguage || !parsedResult.leetTranslation) {
      throw new Error('Invalid response format from AI.');
    }

    return parsedResult;
  } catch (error) {
    console.error('Error translating to leetspeak:', error);
    throw new Error(mapApiError(error));
  }
};