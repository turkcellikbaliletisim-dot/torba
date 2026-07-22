# TORBAA API Sözleşmeleri

## 1. Standartlar
- Tüm uç noktalar `/api/v1` altında sürümlenmelidir.
- JSON kullanılmalıdır.
- Para alanları kuruş bazlı tam sayı olarak taşınmalıdır.
- Yazma işlemlerinde `Idempotency-Key` zorunlu olmalıdır.
- Her yanıtta `request_id` bulunmalıdır.
- Tarihler ISO 8601 UTC formatında dönmelidir.

## 2. Hata Formatı
```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Yetersiz bakiye",
    "details": {},
    "request_id": "req_..."
  }
}
```

## 3. Kimlik Doğrulama
### POST `/auth/otp/request`
Telefon numarasına OTP gönderir.

### POST `/auth/otp/verify`
OTP doğrular, erişim ve yenileme oturumu üretir.

### POST `/auth/refresh`
Oturumu yeniler.

### POST `/auth/logout`
Aktif oturumu kapatır.

## 4. Kullanıcı ve Keşfet
### GET `/me`
Kullanıcı profilini ve hesap özetlerini döner.

### GET `/merchants`
Filtreler:
- latitude / longitude
- radius
- category
- meal_card_enabled
- campaign_available
- open_now

### GET `/merchants/{merchantId}`
İşletme ve şube detaylarını döner.

### GET `/merchants/{merchantId}/campaigns`
Aktif kampanyaları döner.

## 5. Cüzdan
### GET `/wallets`
Toin ve yemek kartı hesaplarını ayrı döner.

### GET `/wallets/{walletId}/transactions`
Sayfalı işlem geçmişi döner.

### GET `/rewards`
Kazanılmış, bekleyen ve geri alınmış Toin hareketlerini döner.

## 6. QR ve Ödeme
### POST `/merchant/qr-intents`
Kasiyer süreli ödeme talebi oluşturur.

İstek:
```json
{
  "branch_id": "br_...",
  "amount_minor": 40000,
  "allowed_methods": ["MEAL", "TOIN"]
}
```

### GET `/qr-intents/{token}`
Kullanıcıya ödeme özeti gösterir.

### POST `/payments`
Kullanıcı onayıyla ödeme gerçekleştirir.

İstek:
```json
{
  "qr_token": "...",
  "payment_method": "MEAL",
  "confirmation_token": "..."
}
```

Yanıt:
- payment_id
- gross_amount_minor
- reward_amount_minor
- remaining_balance_minor
- status

### POST `/payments/{paymentId}/refunds`
Tam veya kısmi iade başlatır.

## 7. İşletme Paneli
### POST `/merchant-applications`
İşletme başvurusu oluşturur.

### GET `/merchant/dashboard`
Ciro, işlem, hakediş ve kampanya özetini döner.

### GET `/merchant/transactions`
Şube, tarih, durum ve ödeme yöntemine göre filtrelenir.

### POST `/merchant/campaigns`
Taslak kampanya oluşturur.

### GET `/merchant/settlements`
Hakediş dönemlerini döner.

### GET `/merchant/settlements/{id}`
Brüt, komisyon, iade ve net tutar kalemlerini döner.

## 8. Kurumsal Panel
### POST `/corporate/employee-imports`
Excel/CSV toplu çalışan aktarımı başlatır.

### POST `/corporate/allowance-batches`
Bakiye yükleme taslağı oluşturur.

### POST `/corporate/allowance-batches/{id}/approve`
Yetkili onayı verir.

### POST `/corporate/allowance-batches/{id}/fund`
Ödeme kuruluşu entegrasyonuyla fonlama başlatır.

### GET `/corporate/reports/usage`
Departman, maliyet merkezi ve dönem bazlı rapor döner.

## 9. Admin API
### GET `/admin/applications`
İşletme ve şirket başvurularını listeler.

### POST `/admin/applications/{id}/approve`
Başvuruyu onaylar.

### POST `/admin/applications/{id}/reject`
Gerekçeli ret verir.

### GET `/admin/payments`
Tüm işlemleri risk ve durum filtreleriyle listeler.

### POST `/admin/refunds/{id}/approve`
Yetkili iade onayı verir.

### GET `/admin/risk-events`
Risk olaylarını döner.

### PATCH `/admin/system-parameters/{key}`
Çift onay gerektiren sistem parametresi değişikliği yapar.

## 10. Güvenlik Kuralları
- İstemci hiçbir bakiye hesabını kendisi yapıp kesin sonuç olarak gönderemez.
- QR tokenları imzalı, tek kullanımlık ve süreli olmalıdır.
- Aynı idempotency anahtarı aynı sonucu döndürmelidir.
- Finansal endpointlerde optimistic UI sonucu kesin işlem sayılmamalıdır.
- Admin finans işlemleri gerekirse maker-checker onayına tabi tutulmalıdır.

## 11. Webhooklar
Ödeme kuruluşundan gelebilecek olaylar:
- funding.completed
- funding.failed
- settlement.completed
- settlement.failed
- account.verification.updated

Webhook imzası doğrulanmalı, olay ID'si benzersiz tutulmalı ve tekrar gönderimler güvenle işlenmelidir.

## 12. API Kabul Kriterleri
- OpenAPI 3.1 belgesi üretilmeli.
- Tüm finansal yazma endpointleri idempotent olmalı.
- Rol ve scope kontrolü her istekte uygulanmalı.
- Rate limit ve audit kaydı bulunmalı.
- Hata kodları dokümante ve kararlı olmalı.
