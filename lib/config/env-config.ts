import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL zorunludur.'),
  REDIS_URL: z.string().min(1, 'REDIS_URL zorunludur.'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET en az 16 karakter olmalıdır.'),
  PAYMENT_API_KEY: z.string().min(1, 'PAYMENT_API_KEY zorunludur.'),
  PAYMENT_SECRET_KEY: z.string().min(1, 'PAYMENT_SECRET_KEY zorunludur.'),
  PAYMENT_BASE_URL: z.string().url('PAYMENT_BASE_URL geçerli bir URL olmalıdır.'),
  PAYMENT_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
});

export interface EnvConfig {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  PAYMENT_API_KEY: string;
  PAYMENT_SECRET_KEY: string;
  PAYMENT_BASE_URL: string;
  PAYMENT_ENV: 'sandbox' | 'production';
}

export function validateEnvConfig(): { isValid: boolean; env?: EnvConfig; error?: string } {
  try {
    const rawEnv = {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || '3000',
      DATABASE_URL: process.env.DATABASE_URL || 'postgres://torba_dev:torba_dev_password@localhost:5432/torba_db',
      REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
      JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_minimum_16_chars',
      PAYMENT_API_KEY: process.env.PAYMENT_API_KEY || 'dev_api_key_craftgate',
      PAYMENT_SECRET_KEY: process.env.PAYMENT_SECRET_KEY || 'dev_secret_key_craftgate',
      PAYMENT_BASE_URL: process.env.PAYMENT_BASE_URL || 'https://sandbox-api.craftgate.io',
      PAYMENT_ENV: process.env.PAYMENT_ENV || 'sandbox',
    };

    const parsed = envSchema.parse(rawEnv);
    return { isValid: true, env: parsed as EnvConfig };
  } catch (err: any) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Kritik Konfigürasyon Hatası: Ortam değişkenleri doğrulanamadı. ${err.message}`);
    }
    return { isValid: false, error: err.message };
  }
}
