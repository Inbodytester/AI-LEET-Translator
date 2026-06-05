interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export const checkRateLimit = (clientId: string): RateLimitResult => {
  const now = Date.now();
  let entry = store.get(clientId);

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(clientId, entry);
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { allowed: true };
};

export const getClientIpFromRequest = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'anonymous';
};

export const getClientIpFromHeaders = (
  headers: Record<string, string | string[] | undefined>
): string => {
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded) && forwarded[0]) return forwarded[0].split(',')[0].trim();
  const realIp = headers['x-real-ip'];
  if (typeof realIp === 'string') return realIp;
  return 'anonymous';
};

export const RATE_LIMIT_ERROR_PREFIX = 'Too many requests';