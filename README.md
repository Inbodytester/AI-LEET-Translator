# AI Leet Speak Translator

A modern web app that detects the language of your text and translates it into 1337 (leet) speak using Google Gemini.

## Features

- Automatic language detection
- AI-powered leet speak translation
- Light / dark theme
- Translation history (last 50 entries)
- Application log viewer

## Prerequisites

- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/apikey)

## Setup

```bash
git clone https://github.com/Inbodytester/AI-LEET-Translator.git
cd AI-LEET-Translator
npm install
cp .env.example .env
# Edit .env and set GEMINI_API_KEY
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:3000`).

## Environment variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key (server-side only) |

**Important:** The API key is never bundled into the client. Translation runs through `/api/translate` on the server.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with API middleware |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests |

## Deployment (Vercel)

1. Import the repo on [Vercel](https://vercel.com).
2. Add `GEMINI_API_KEY` in Project → Settings → Environment Variables.
3. Deploy.

The `api/translate.ts` serverless function handles translation in production. `vercel.json` routes SPA traffic to `index.html`.

## Project structure

```
api/translate.ts          # Vercel serverless handler
server/translateCore.ts   # Gemini translation logic
services/geminiService.ts   # Client API wrapper (fetch)
vite-plugins/apiTranslate.ts  # Dev server API middleware
```

## License

MIT (see repository for details).