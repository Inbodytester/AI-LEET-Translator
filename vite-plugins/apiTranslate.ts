import type { Plugin, Connect } from 'vite';
import { handleTranslateFromHeaders } from '../server/handleTranslate';

const readBody = (req: Connect.IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

export const apiTranslatePlugin = (): Plugin => ({
  name: 'api-translate-dev',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url !== '/api/translate' || req.method !== 'POST') {
        return next();
      }

      try {
        const raw = await readBody(req);
        const body = raw ? JSON.parse(raw) : {};
        const text = typeof body?.text === 'string' ? body.text : '';
        const { status, body: responseBody, headers } = await handleTranslateFromHeaders(
          text,
          req.headers
        );

        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        if (headers) {
          for (const [key, value] of Object.entries(headers)) {
            res.setHeader(key, value);
          }
        }
        res.end(JSON.stringify(responseBody));
      } catch {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Translation failed' }));
      }
    });
  },
});