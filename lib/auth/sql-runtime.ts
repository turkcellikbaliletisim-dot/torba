import type { OtpDeliveryGateway } from '@/lib/auth/contracts';
import type { AuditLogRepository } from '@/lib/repositories/contracts';
import type { SqlClient } from '@/lib/db/sql';
import { OtpService } from '@/lib/auth/otp-service';
import { InMemoryRateLimiter } from '@/lib/auth/rate-limit';
import { configureAuthRuntime, type AuthRuntime } from '@/lib/auth/runtime';
import { SessionService } from '@/lib/auth/session-service';
import { SqlOtpChallengeRepository } from '@/lib/auth/sql-otp-challenge-repository';
import { SqlAuthSessionRepository } from '@/lib/auth/sql-session-repository';
import { SqlAuthUserResolver } from '@/lib/auth/sql-user-resolver';

export interface ConfigureSqlAuthRuntimeOptions {
  client: SqlClient;
  otpDelivery: OtpDeliveryGateway;
  otpPepper: string;
  audit?: AuditLogRepository;
  rateLimiter?: InMemoryRateLimiter;
}

export function configureSqlAuthRuntime(
  options: ConfigureSqlAuthRuntimeOptions,
): AuthRuntime {
  const pepper = options.otpPepper.trim();
  if (pepper.length < 16) {
    throw new Error('OTP pepper must contain at least 16 characters.');
  }

  const sessionRepository = new SqlAuthSessionRepository(options.client);
  const challengeRepository = new SqlOtpChallengeRepository(options.client);

  return configureAuthRuntime({
    otp: new OtpService(challengeRepository, options.otpDelivery, pepper),
    sessions: new SessionService(sessionRepository),
    users: new SqlAuthUserResolver(options.client),
    rateLimiter: options.rateLimiter ?? new InMemoryRateLimiter(),
    audit: options.audit,
    sessionRepository,
  });
}
