import { SignJWT, jwtVerify } from 'jose';

export interface UserSessionPayload {
  userId: string;
  phone: string;
  role: 'ADMIN' | 'MERCHANT' | 'CORPORATE_HR' | 'CUSTOMER';
  fullName: string;
  merchantId?: string;
  corporateCompanyId?: string;
}

const JWT_SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'torbaa_jwt_secure_secret_key_2026_prod_minimum_32_chars'
);

export async function signSessionToken(payload: UserSessionPayload, expiresIn = '8h'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setIssuer('torbaa-auth')
    .sign(JWT_SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY, {
      issuer: 'torbaa-auth',
    });
    return payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}
