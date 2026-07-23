import { jsonError, jsonSuccess } from '@/lib/api/response';

export async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new AuthHttpError('UNSUPPORTED_MEDIA_TYPE', 'Content-Type application/json olmalıdır.', 415);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new AuthHttpError('INVALID_JSON', 'Geçerli bir JSON gövdesi gönderilmelidir.', 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AuthHttpError('INVALID_BODY', 'İstek gövdesi bir JSON nesnesi olmalıdır.', 400);
  }

  return body as Record<string, unknown>;
}

export function requireString(
  body: Record<string, unknown>,
  field: string,
  options: { min?: number; max?: number } = {},
): string {
  const value = body[field];
  if (typeof value !== 'string') {
    throw new AuthHttpError('VALIDATION_ERROR', `${field} alanı zorunludur.`, 400);
  }

  const normalized = value.trim();
  if (normalized.length < (options.min ?? 1) || normalized.length > (options.max ?? 255)) {
    throw new AuthHttpError('VALIDATION_ERROR', `${field} alanı geçersizdir.`, 400);
  }

  return normalized;
}

export class AuthHttpError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AuthHttpError';
  }
}

export function authHttpResponse(error: unknown): Response {
  if (error instanceof AuthHttpError) {
    return jsonError(error.code, error.message, error.status, error.details);
  }

  console.error('Unhandled auth HTTP error', error);
  return jsonError('INTERNAL_ERROR', 'İşlem tamamlanamadı.', 500);
}

export { jsonSuccess };
