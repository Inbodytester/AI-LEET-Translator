import { translateToLeetSpeak, getErrorStatus } from '../server/translateCore';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text : '';
    const result = await translateToLeetSpeak(text);
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return Response.json({ error: message }, { status: getErrorStatus(message) });
  }
}