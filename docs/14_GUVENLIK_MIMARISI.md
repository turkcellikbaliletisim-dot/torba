# TORBAA Güvenlik Mimarisi

## 1. Amaç
TORBAA, sadakat ve keşif özelliklerinin yanında finansal bakiye, yemek kartı, işletme hakedişi ve kurumsal fonlama süreçleri yönettiği için güvenlik tasarımı en baştan ürün mimarisine dahil edilmelidir.

## 2. Güvenlik İlkeleri
- En az yetki
- Sıfır güven yaklaşımı
- Katmanlı savunma
- Varsayılan olarak kapalı erişim
- Finansal kayıtların değiştirilemezliği
- Hassas verinin en az düzeyde toplanması
- Kritik işlemlerde görevler ayrılığı

## 3. Kimlik Doğrulama
### Kullanıcı
- Telefon OTP
- Riskli işlemlerde PIN veya biyometrik doğrulama
- Cihaz oturumu ve cihaz güven puanı

### İşletme, Kurumsal ve Admin
- Güçlü parola veya kurumsal SSO
- Zorunlu MFA
- Oturum süresi ve yeniden doğrulama
- Şüpheli IP ve cihaz uyarısı

## 4. Oturum Güvenliği
- Erişim tokenı kısa ömürlü olmalıdır.
- Yenileme tokenı döndürülmeli ve iptal edilebilir olmalıdır.
- Web tarafında güvenli, HttpOnly ve SameSite cookie tercih edilmelidir.
- Oturumlar cihaz bazında listelenip kapatılabilmelidir.
- Parola ve OTP denemelerine rate limit uygulanmalıdır.

## 5. Veri Güvenliği
- Aktarımda TLS zorunlu olmalıdır.
- Hassas veriler veritabanında şifrelenmelidir.
- IBAN, kimlik ve iletişim bilgileri arayüzde maskelenmelidir.
- Şifreler Argon2id veya güncel güçlü algoritmayla hashlenmelidir.
- Anahtarlar kod deposunda tutulmamalı; secret manager kullanılmalıdır.
- Üretim verisi geliştirme ortamına kopyalanmamalıdır.

## 6. QR ve Ödeme Güvenliği
- QR tokenı tahmin edilemez, imzalı ve tek kullanımlık olmalıdır.
- Kısa son kullanma süresi bulunmalıdır.
- Tutar ve şube bilgisi tokenla ilişkilendirilmelidir.
- Kullanıcı ödeme öncesi tutarı ve işletmeyi açıkça görmelidir.
- Aynı işlem idempotency kontrolü olmadan işlenmemelidir.
- Bakiye ve kampanya hesabı yalnızca sunucuda yapılmalıdır.
- İade, ters kayıt ve hakediş bağlantısı korunmalıdır.

## 7. Uygulama Güvenliği
- Girdi doğrulama için merkezi şema kullanılmalıdır.
- SQL injection, XSS, CSRF, SSRF ve dosya yükleme riskleri test edilmelidir.
- Dosyalar zararlı içerik taramasından geçirilmelidir.
- Güvenlik başlıkları ve içerik güvenlik politikası uygulanmalıdır.
- Bağımlılık açıkları otomatik taranmalıdır.
- Kod incelemesi olmadan finansal modül canlıya alınmamalıdır.

## 8. API Güvenliği
- Her endpoint kimlik, izin ve scope kontrolü yapmalıdır.
- Kullanıcı, işletme ve IP bazlı rate limit uygulanmalıdır.
- Webhook imzası ve timestamp doğrulanmalıdır.
- Hassas yanıtlar cache edilmemelidir.
- Hata mesajları iç sistem ayrıntısı sızdırmamalıdır.
- Tüm kritik isteklerde request ID ve audit izi bulunmalıdır.

## 9. Risk ve Sahtecilik Kontrolleri
Risk sinyalleri:
- Kısa sürede çok sayıda işlem
- Aynı cihazda çok sayıda hesap
- Alışılmadık konum veya cihaz
- İşletme ve kullanıcı arasında tekrarlanan yuvarlak tutarlar
- İade oranında ani artış
- İşlem sonrası hızlı Toin harcama denemesi
- Kapalı saatlerde olağandışı işlem

Aksiyonlar:
- Ek doğrulama
- İşlemi beklemeye alma
- Hesabı geçici kısıtlama
- Manuel risk incelemesi
- Hakedişi geçici durdurma

## 10. Audit Log
Aşağıdaki olaylar değiştirilemez audit kaydı üretmelidir:
- Giriş ve başarısız girişler
- Rol ve yetki değişiklikleri
- İşletme ve şirket onayları
- Banka hesabı değişiklikleri
- Komisyon ve sistem parametresi değişiklikleri
- Bakiye yükleme, ödeme, iade ve hakediş
- Risk kararı ve hesap kısıtlaması

Audit kaydında aktör, zaman, kaynak, önceki değer, yeni değer, IP, cihaz ve gerekçe bulunmalıdır.

## 11. Altyapı ve Operasyon
- Geliştirme, test ve üretim ortamları ayrılmalıdır.
- Veritabanı internete doğrudan açık olmamalıdır.
- Yedekler şifreli tutulmalı ve geri yükleme testi yapılmalıdır.
- Merkezi loglama, alarm ve olay yönetimi kurulmalıdır.
- Kritik servisler için RPO/RTO hedefleri belirlenmelidir.
- Üretim erişimi süreli ve onaylı olmalıdır.

## 12. Güvenlik Testleri
Canlı öncesi:
- SAST
- Dependency scan
- Secret scan
- DAST
- Yetki matrisi testleri
- Finansal idempotency ve yarış koşulu testleri
- Penetrasyon testi
- Yedekten dönüş testi

## 13. Olay Müdahale
- Olay sınıflandırması
- Yetkili iletişim zinciri
- Etkilenen hesapları kısıtlama
- Kanıt ve log koruma
- Kök neden analizi
- Gerekli kullanıcı ve resmi bildirim süreçleri
- Düzeltici aksiyon takibi

## 14. Canlıya Geçiş Kapısı
Aşağıdakiler tamamlanmadan gerçek para veya yemek kartı işlemi açılmamalıdır:
- Tehdit modellemesi
- Yetki testleri
- Ledger denge testleri
- Penetrasyon testi
- Secret ve anahtar yönetimi
- Olay müdahale planı
- Yedek ve geri dönüş testi
- Hukuk ve ödeme ortağı güvenlik onayı
