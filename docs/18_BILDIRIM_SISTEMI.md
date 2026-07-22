# TORBAA Bildirim Sistemi

## 1. Amaç
Bildirim sistemi; işlem sonuçlarını, kampanyaları, hakedişleri, güvenlik olaylarını ve operasyonel görevleri doğru kullanıcıya doğru kanaldan iletir.

## 2. Kanallar
- Uygulama içi bildirim
- Push bildirim
- SMS
- E-posta
- Admin görev kutusu
- İşletme ve kurumsal panel bildirim merkezi

## 3. Bildirim Türleri
### İşlemsel
- Ödeme başarılı/başarısız
- Toin kazanıldı/kullanıldı
- İade tamamlandı
- Bakiye yüklendi
- Hakediş gönderildi

### Güvenlik
- Yeni cihaz girişi
- Şüpheli işlem
- Şifre/PIN değişikliği
- Oturum sonlandırma
- Kritik admin işlemi

### Operasyon
- İşletme başvurusu sonucu
- Belge eksikliği
- Kampanya onayı
- Destek talebi güncellemesi
- Mutabakat farkı

### Pazarlama
- Yakındaki kampanya
- Favori işletme fırsatı
- Süresi dolacak ödül
- Yeniden etkinleştirme

## 4. Tercih ve İzinler
- İşlemsel ve güvenlik bildirimleri kapatılamaz veya yalnızca kanal tercihleri değiştirilebilir.
- Pazarlama bildirimleri ayrı izin gerektirir.
- Kullanıcı kanal ve kategori tercihlerini değiştirebilir.
- İzin değişiklikleri audit kaydına alınır.

## 5. Teknik Model
### notification_templates
- code
- channel
- locale
- subject
- body
- version

### notification_events
- event_type
- recipient_type
- recipient_id
- payload_json
- priority

### notification_deliveries
- channel
- provider_reference
- status
- sent_at
- delivered_at
- failed_reason

## 6. Teslimat Kuralları
- Aynı olay için tekrar bildirim engellenmelidir.
- Kritik bildirimler retry kuyruğuna alınmalıdır.
- Sağlayıcı hataları izlenmelidir.
- Toplu kampanyalarda hız limiti uygulanmalıdır.
- Gece saatleri pazarlama bildirimlerinde sessiz saat olarak yönetilmelidir.

## 7. Şablon Yönetimi
- Şablonlar versiyonlu olmalıdır.
- Değişkenler doğrulanmalıdır.
- Hukuki metinler admin onayı olmadan değişmemelidir.
- Test gönderimi desteklenmelidir.

## 8. Kullanıcı Deneyimi
Bildirim merkezi:
- Okundu/okunmadı
- Tür filtresi
- İlgili işlem veya kampanyaya bağlantı
- Toplu okundu işaretleme
- Kritik bildirimleri sabitleme
özelliklerini içermelidir.

## 9. İzleme
- Gönderim başarısı
- Teslim oranı
- Açılma oranı
- SMS maliyeti
- Push token geçersizlik oranı
- Şikâyet/izin iptal oranı
raporlanmalıdır.
