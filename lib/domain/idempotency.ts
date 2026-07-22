const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9._:-]{16,128}$/;

export function normalizeIdempotencyKey(value: string | null | undefined): string {
  const key = value?.trim();

  if (!key) {
    throw new Error('Idempotency key is required.');
  }

  if (!IDEMPOTENCY_KEY_PATTERN.test(key)) {
    throw new Error(
      'Idempotency key must be 16-128 characters and contain only letters, numbers, dot, underscore, colon or dash.',
    );
  }

  return key;
}

export function buildScopedIdempotencyKey(
  scope: string,
  actorId: string,
  key: string,
): string {
  const normalizedScope = scope.trim().toLowerCase();
  const normalizedActorId = actorId.trim();

  if (!normalizedScope) {
    throw new Error('Idempotency scope is required.');
  }

  if (!normalizedActorId) {
    throw new Error('Idempotency actorId is required.');
  }

  return `${normalizedScope}:${normalizedActorId}:${normalizeIdempotencyKey(key)}`;
}
