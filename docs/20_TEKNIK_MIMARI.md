# TORBAA Teknik Mimari

## 1. Amaç
Bu belge TORBAA'nın mobil uygulama, işletme paneli, kurumsal panel, admin paneli ve finansal işlem çekirdeği için önerilen teknik mimariyi tanımlar.

## 2. Mimari Yaklaşım
İlk sürümde modüler monolit tercih edilir. Finansal ledger, ödeme, hakediş ve kimlik modülleri sınırları net biçimde ayrılır. Ölçek büyüdüğünde bu modüller bağımsız servislere ayrılabilir.

## 3. İstemci Katmanı
- Web: Next.js, TypeScript
- Mobil: İlk pilotta responsive web/PWA; doğrulama sonrası React Native veya Flutter
- Ortak tasarım sistemi
- Sunucu tarafı yetki kontrolü
- Form doğrulama ve hata yönetimi

## 4. Backend Katmanı
Önerilen modüller:
- Auth
- User
- Merchant
- Corporate
- Campaign
- Reward
- Wallet
- Ledger
- Payment
- Refund
- Settlement
- Notification
- Risk
- Support
- Admin
- Reporting

## 5. Veri Katmanı
- PostgreSQL: Ana işlemsel veri
- Redis: Rate limit, kısa süreli token, cache ve job kilitleri
- Object storage: Belge, görsel ve sözleşmeler
- Queue: Bildirim, hakediş, webhook ve rapor işleri
- Arama motoru: Pilot sonrasında işletme keşfi için değerlendirilebilir

## 6. Finansal İşlem Akışı
1. İstek kimlik ve yetki kontrolünden geçer.
2. Risk ve limit kontrolleri yapılır.
3. Idempotency anahtarı kontrol edilir.
4. Ledger transaction ve entries tek veritabanı işlemi içinde yazılır.
5. İşlem sonucu event/outbox kaydına yazılır.
6. Bildirim ve dış entegrasyonlar asenkron çalışır.

## 7. Outbox Deseni
Veritabanı işlemi başarılı olup mesaj kuyruğu başarısız olduğunda veri kaybını önlemek için transactional outbox kullanılmalıdır.

## 8. API Katmanı
- `/api/v1` sürümleme
- OpenAPI sözleşmesi
- Tek tip hata modeli
- Correlation ID
- Rate limit
- Idempotency
- Webhook imzası

## 9. Harici Entegrasyonlar
- SMS/OTP sağlayıcısı
- Push bildirim sağlayıcısı
- E-posta sağlayıcısı
- Ödeme/elektronik para kuruluşu
- Banka/hakediş transferi
- E-fatura veya muhasebe entegrasyonu
- Harita ve konum servisi

Her entegrasyon adapter arayüzü arkasında tutulmalıdır.

## 10. Gözlemlenebilirlik
- Merkezi log
- Metrics
- Distributed tracing
- Hata izleme
- Finansal mutabakat alarmı
- Kritik job alarmı

## 11. Ortamlar
- Local
- Development
- Staging
- Production

Üretim verisi geliştirme ortamına kopyalanmamalıdır.

## 12. Ölçekleme
- Stateless uygulama instance'ları
- Yatay ölçekleme
- Read replica yalnızca gerekli olduğunda
- Ağır raporların asenkron üretilmesi
- Cache yalnızca kaynak veri doğruluğunu bozmadan kullanılmalı

## 13. Mimari Karar Kayıtları
Önemli teknoloji ve ürün kararları `docs/adr/` altında ADR formatında tutulmalıdır.

## 14. İlk Teknik Teslimatlar
- Modül sınırları
- Prisma/ORM şeması
- Migration altyapısı
- Auth ve RBAC
- Ledger çekirdeği
- OpenAPI
- Outbox ve queue
- Audit log
