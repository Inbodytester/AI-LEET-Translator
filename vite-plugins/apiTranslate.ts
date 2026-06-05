import type { Plugin, Connect } from 'vite';
import { translateToLeetSpeak, getErrorStatus } from '../server/translateCore';

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
        const result = await translateToLeetSpeak(text);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Translation failed';
        res.statusCode = getErrorStatus(message);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: message }));
      }
    });
  },
});