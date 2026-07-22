# TORBAA DevOps ve Deployment

## 1. Amaç
Bu belge geliştirme, test, dağıtım, izleme, yedekleme ve geri dönüş süreçlerini tanımlar.

## 2. Kaynak Kod ve Dal Stratejisi
- `main`: Korunan üretim dalı
- `develop` zorunlu değildir; küçük ekipte kısa ömürlü feature branch kullanılabilir
- Her değişiklik PR ile alınır
- Finansal modüllerde en az bir teknik inceleme gerekir

## 3. CI Aşamaları
Her PR için:
- Paket kurulumu
- Lint
- Type check
- Unit test
- Integration test
- Build
- Güvenlik bağımlılık taraması
- Migration doğrulaması

## 4. CD Aşamaları
- PR preview ortamı
- Staging dağıtımı
- Smoke test
- Manuel onay
- Production dağıtımı
- Dağıtım sonrası health check

## 5. Infrastructure as Code
- Ağ
- Veritabanı
- Cache
- Object storage
- Secrets
- Monitoring
- Queue
altyapısı kodla tanımlanmalıdır.

## 6. Secret Yönetimi
- `.env` dosyaları repoya alınmaz
- Üretim anahtarları secret manager içinde tutulur
- Düzenli anahtar rotasyonu yapılır
- Ortamlar arası secret paylaşılmaz

## 7. Migration Stratejisi
- Migration dosyaları versiyonlanır
- Geriye uyumlu schema değişiklikleri tercih edilir
- Büyük tabloda bloklayıcı migration yapılmaz
- Finansal tablo migration'ları staging'de gerçekçi veriyle test edilir

## 8. Yedekleme
- Otomatik veritabanı yedeği
- Point-in-time recovery
- Object storage versiyonlama
- Düzenli geri yükleme testi
- Yedek erişimleri sınırlandırılır

## 9. Geri Dönüş
- Uygulama sürümü hızlı geri alınabilmeli
- Veritabanı değişikliklerinde forward-fix öncelikli olmalı
- Feature flag ile riskli özellik kapatılabilmeli

## 10. İzleme ve Alarm
- API hata oranı
- P95/P99 yanıt süresi
- Başarısız ödeme oranı
- Ledger dengesizlik alarmı
- Hakediş job başarısızlığı
- Queue gecikmesi
- Veritabanı bağlantı ve disk kullanımı
- SMS/OTP başarısızlık oranı

## 11. Loglama
- Yapılandırılmış JSON log
- Correlation ID
- Hassas veri maskeleme
- Audit log ayrı saklama
- Log saklama süresi politika ile belirlenir

## 12. Ortam Erişimleri
- En az ayrıcalık
- Production erişimi sınırlı
- MFA zorunlu
- Acil erişim kayıtlı ve süreli

## 13. Canlıya Geçiş Kontrolü
- Tüm kritik testler başarılı
- Backup ve restore doğrulanmış
- Monitoring aktif
- Runbook hazır
- Olay sorumluları belirlenmiş
- Hukuki ve finansal onaylar tamamlanmış
