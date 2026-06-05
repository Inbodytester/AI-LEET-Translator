import { translateToLeetSpeak, getErrorStatus } from './translateCore';
import {
  checkRateLimit,
  getClientIpFromRequest,
  getClientIpFromHeaders,
  RATE_LIMIT_ERROR_PREFIX,
} from './rateLimit';
import type { TranslationResult } from '../types';

export interface TranslateResponse {
  status: number;
  body: TranslationResult | { error: string };
  headers?: Record<string, string>;
}

export const handleTranslate = async (
  text: string,
  clientId: string
): Promise<TranslateResponse> => {
  const rateCheck = checkRateLimit(clientId);
  if (!rateCheck.allowed) {
    const error = `${RATE_LIMIT_ERROR_PREFIX}. Please try again in ${rateCheck.retryAfterSeconds} seconds.`;
    return {
      status: 429,
      body: { error },
      headers: { 'Retry-After': String(rateCheck.retryAfterSeconds ?? 60) },
    };
  }

  try {
    const result = await translateToLeetSpeak(text);
    return { status: 200, body: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return { status: getErrorStatus(message), body: { error: message } };
  }
};

export const handleTranslateRequest = async (request: Request): Promise<Response> => {
  const body = await request.json();
  const text = typeof body?.text === 'string' ? body.text : '';
  const clientId = getClientIpFromRequest(request);
  const { status, body: responseBody, headers } = await handleTranslate(text, clientId);
  return Response.json(responseBody, { status, headers });
};

export const handleTranslateFromHeaders = async (
  text: string,
  headers: Record<string, string | string[] | undefined>
): Promise<TranslateResponse> => {
  const clientId = getClientIpFromHeaders(headers);
  return handleTranslate(text, clientId);
};