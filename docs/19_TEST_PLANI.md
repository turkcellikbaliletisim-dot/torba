# TORBAA Test Planı

## 1. Amaç
TORBAA'nın sadakat, yemek kartı, ledger, hakediş ve yönetim panellerinin işlevsel, güvenli ve tutarlı çalıştığını doğrulamak.

## 2. Test Katmanları
- Unit test
- Servis/entegrasyon testi
- API sözleşme testi
- Veritabanı ve migration testi
- Uçtan uca test
- Güvenlik testi
- Yük ve performans testi
- Kullanıcı kabul testi
- Finansal mutabakat testi

## 3. Kritik Finansal Testler
- Çift taraflı ledger her işlemde dengeli
- Aynı idempotency key ikinci kez işlem yaratmıyor
- Yetersiz bakiye reddediliyor
- Tam ve kısmi iade doğru ters kayıt üretiyor
- Toplam iade ödeme tutarını aşmıyor
- İade sonrası Toin geri alınıyor
- Komisyon ve net hakediş doğru hesaplanıyor
- Hakediş batch toplamı alt işlemlerle eşleşiyor
- Provider ve banka kayıtlarıyla mutabakat sağlanıyor

## 4. QR ve Ödeme Testleri
- Geçerli QR
- Süresi geçmiş QR
- Daha önce kullanılmış QR
- Yanlış şube/kasiyer
- Tutar değişikliği
- Ağ kesintisi
- Timeout sonrası tekrar deneme
- Eşzamanlı çift istek
- Risk kuralı nedeniyle bekletme

## 5. Toin ve Kampanya Testleri
- Kampanya tarih aralığı
- Minimum sepet
- Kullanıcı/işletme limitleri
- Kampanya bütçesi
- Standart ve kampanyalı oran
- Seviye etkisi
- İade ve ters kazanım
- Süre sonu
- Kötüye kullanım limiti

## 6. Rol ve Yetki Testleri
Her rol için pozitif ve negatif test yazılmalıdır:
- Kullanıcı başka kullanıcının verisini göremez
- Kasiyer hakediş ve banka hesabını değiştiremez
- İşletme yalnızca kendi şubelerini yönetir
- Kurumsal yönetici yalnızca kendi çalışanlarını görür
- Destek personeli bakiye değiştiremez
- Finans işlemi çift onay gerektirir
- Super admin yetkisi denetlenir

## 7. Uçtan Uca Senaryolar
### Sadakat
Kayıt → işletme keşfi → QR ile Toin kazanma → işlem geçmişi → Toin kullanma

### Yemek Kartı
Şirket oluşturma → çalışan ekleme → toplu bakiye → QR ödeme → işletme alacağı → hakediş → mutabakat

### İade
Ödeme → destek talebi → yetkili onay → ters ledger → kullanıcı ve işletme bildirimi

### İşletme Başvurusu
Başvuru → belge yükleme → admin kontrolü → sözleşme → şube/kasiyer → ilk işlem

## 8. Güvenlik Testleri
- OWASP web ve API kontrolleri
- Yetki yükseltme
- IDOR
- Rate limit
- OTP brute force
- Token çalma/yenileme
- Webhook imza doğrulama
- SQL/NoSQL injection
- XSS/CSRF
- Dosya yükleme güvenliği
- Hassas veri sızıntısı
- Audit log bütünlüğü

## 9. Performans Testleri
Ölçülecekler:
- Ödeme API gecikmesi
- Eşzamanlı QR işlemleri
- Ledger yazma kapasitesi
- İşletme keşif sorguları
- Dashboard raporları
- Bildirim kuyrukları

Finansal işlemler yüksek yük altında kayıp veya tekrar üretmemelidir.

## 10. Test Verisi
- Gerçek kişisel veri kullanılmamalı
- Maskeleme ve sentetik veri kullanılmalı
- Finansal testler deterministik olmalı
- Ortamlar birbirinden ayrılmalı

## 11. CI Kapıları
Bir PR birleştirilmeden önce:
- Lint
- Type check
- Unit test
- API contract test
- Migration doğrulama
- Kritik E2E smoke test
geçmelidir.

## 12. Canlıya Geçiş Kriterleri
- Kritik ve yüksek hata açık değil
- Ledger/mutabakat testleri yüzde 100 başarılı
- Yetki testleri başarılı
- Penetrasyon bulguları kapalı veya kabul edilmiş
- Yedekten geri dönüş denenmiş
- Pilot UAT onayı alınmış

## 13. Canlı Sonrası
- Sentetik ödeme kontrolleri
- Başarısız işlem alarmı
- Mutabakat fark alarmı
- Hata bütçesi ve olay incelemesi
- Düzenli regresyon paketi
