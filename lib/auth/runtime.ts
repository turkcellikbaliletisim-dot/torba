import type { AuthSessionRepository } from '@/lib/auth/contracts';
import type { AuthHandlersDependencies } from '@/lib/auth/handlers';
import { createAuthHandlers } from '@/lib/auth/handlers';

export interface AuthRuntime {
  handlers: ReturnType<typeof createAuthHandlers>;
  sessions: AuthSessionRepository;
}

let runtime: AuthRuntime | null = null;

export function configureAuthRuntime(dependencies: AuthHandlersDependencies & {
  sessionRepository: AuthSessionRepository;
}): AuthRuntime {
  runtime = {
    handlers: createAuthHandlers(dependencies),
    sessions: dependencies.sessionRepository,
  };

  return runtime;
}

export function getAuthRuntime(): AuthRuntime {
  if (!runtime) {
    throw new Error('Auth runtime is not configured.');
  }

  return runtime;
}
