import { z } from 'zod';

export const SendOtpSchema = z.object({
  phone: z
    .string()
    .min(10, 'Telefon numarası en az 10 hane olmalıdır.')
    .max(15, 'Geçersiz telefon numarası.')
    .regex(/^[0-9+]+$/, 'Telefon sadece rakam ve + içerebilir.'),
});

export const VerifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z
    .string()
    .length(6, 'Doğrulama kodu tam 6 haneli olmalıdır.')
    .regex(/^[0-9]+$/, 'Kod sadece rakam içerebilir.'),
});

export const GenerateQrSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID gereklidir.'),
  branchId: z.string().min(1, 'Şube ID gereklidir.'),
  amountMinor: z.number().positive('Harcama tutarı pozitif olmalıdır.'),
});

export const VerifyQrSchema = z.object({
  qrToken: z.string().min(20, 'Geçersiz QR token formatı.'),
});

export const PaymentIntentSchema = z.object({
  merchantId: z.string().min(1),
  branchId: z.string().min(1),
  amountMinor: z.number().positive(),
  paymentType: z.enum(['YEMEK_KARTI', 'TOIN_PUAN', 'KREDİ_KARTI']),
  idempotencyKey: z.string().min(10, 'Idempotency key zorunludur.'),
});

export const CorporateAllowanceSchema = z.object({
  corporateCompanyId: z.string().min(1),
  month: z.string().min(1),
  totalAmountMinor: z.number().positive(),
  employeeCount: z.number().int().positive(),
});
