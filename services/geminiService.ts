
import { GoogleGenAI, Type } from "@google/genai";
import type { TranslationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const translateToLeetSpeak = async (text: string): Promise<TranslationResult> => {
  const prompt = `
    Your task is to act as an expert 1337 (leet) speak translator.
    First, automatically identify the language of the provided text.
    Then, translate the text into advanced, creative, and authentic-sounding leet speak. Use a mix of numbers, symbols, and phonetic replacements.
    Provide your response in the requested JSON format.

    Text to translate: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: translationSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResult = JSON.parse(jsonString) as TranslationResult;

    if (!parsedResult.detectedLanguage || !parsedResult.leetTranslation) {
        throw new Error("Invalid response format from AI.");
    }
    
    return parsedResult;

  } catch (error) {
    console.error("Error translating to leetspeak:", error);
    throw new Error("Failed to get a valid translation from the AI.");
  }
};
