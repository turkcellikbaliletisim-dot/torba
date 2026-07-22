import { NextResponse } from 'next/server';
import type { AuditLogRepository } from '@/lib/repositories/contracts';
import type { OtpService } from '@/lib/auth/otp-service';
import type { SessionService } from '@/lib/auth/session-service';
import type { AuthUserResolver } from '@/lib/auth/user-resolver';
import type { InMemoryRateLimiter } from '@/lib/auth/rate-limit';
import { clearSessionCookie, SESSION_COOKIE_NAME, setSessionCookie } from '@/lib/auth/cookie';
import { AuthHttpError, authHttpResponse, readJsonObject, requireString } from '@/lib/auth/http';

export interface AuthHandlersDependencies {
  otp: OtpService;
  sessions: SessionService;
  users: AuthUserResolver;
  rateLimiter: InMemoryRateLimiter;
  audit?: AuditLogRepository;
}

function clientKey(request: Request, destination: string): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return `${forwarded ?? 'unknown'}:${destination}`;
}

export function createAuthHandlers(deps: AuthHandlersDependencies) {
  return {
    requestOtp: async (request: Request): Promise<Response> => {
      try {
        const body = await readJsonObject(request);
        const destination = requireString(body, 'destination', { min: 6, max: 160 });
        const purpose = requireString(body, 'purpose', { min: 3, max: 50 });
        const key = `otp-request:${clientKey(request, destination)}:${purpose}`;

        if (!deps.rateLimiter.allow(key, 5, 15 * 60 * 1000)) {
          throw new AuthHttpError('RATE_LIMITED', 'Çok fazla doğrulama kodu istendi.', 429);
        }

        await deps.otp.request(destination, purpose);
        await deps.audit?.append({
          action: 'AUTH_OTP_REQUESTED',
          entityType: 'AUTH_DESTINATION',
          metadata: { destinationMasked: destination.slice(-4), purpose },
        });

        return NextResponse.json({ success: true }, { status: 202 });
      } catch (error) {
        return authHttpResponse(error);
      }
    },

    verifyOtp: async (request: Request): Promise<Response> => {
      try {
        const body = await readJsonObject(request);
        const destination = requireString(body, 'destination', { min: 6, max: 160 });
        const purpose = requireString(body, 'purpose', { min: 3, max: 50 });
        const code = requireString(body, 'code', { min: 6, max: 6 });
        const key = `otp-verify:${clientKey(request, destination)}:${purpose}`;

        if (!deps.rateLimiter.allow(key, 10, 15 * 60 * 1000)) {
          throw new AuthHttpError('RATE_LIMITED', 'Çok fazla doğrulama denemesi yapıldı.', 429);
        }

        const valid = await deps.otp.verify(destination, purpose, code);
        if (!valid) {
          throw new AuthHttpError('INVALID_OTP', 'Doğrulama kodu geçersiz veya süresi dolmuş.', 401);
        }

        const user = await deps.users.resolveByDestination(destination);
        if (!user) {
          throw new AuthHttpError('USER_NOT_FOUND', 'Bu bilgilerle eşleşen aktif kullanıcı bulunamadı.', 404);
        }

        const created = await deps.sessions.create({
          userId: user.id,
          roles: user.roles,
          permissions: user.permissions,
        });

        const response = NextResponse.json({
          success: true,
          data: { userId: user.id, expiresAt: created.expiresAt.toISOString() },
        });
        setSessionCookie(response, created.token, created.expiresAt);

        await deps.audit?.append({
          actorUserId: user.id,
          action: 'AUTH_SESSION_CREATED',
          entityType: 'AUTH_SESSION',
          entityId: created.sessionId,
        });

        return response;
      } catch (error) {
        return authHttpResponse(error);
      }
    },

    logout: async (request: Request): Promise<Response> => {
      try {
        const cookie = request.headers.get('cookie') ?? '';
        const token = cookie
          .split(';')
          .map((item) => item.trim())
          .find((item) => item.startsWith(`${SESSION_COOKIE_NAME}=`))
          ?.slice(SESSION_COOKIE_NAME.length + 1);

        if (token) await deps.sessions.revokeByToken(decodeURIComponent(token));

        const response = NextResponse.json({ success: true });
        clearSessionCookie(response);
        return response;
      } catch (error) {
        return authHttpResponse(error);
      }
    },
  };
}
