import { handleTranslateRequest } from '../server/handleTranslate';

export async function POST(request: Request): Promise<Response> {
  return handleTranslateRequest(request);
}