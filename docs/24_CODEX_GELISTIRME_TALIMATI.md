# TORBAA Codex Geliştirme Talimatı

## 1. Amaç
Bu belge Codex veya başka bir yazılım ajanının TORBAA reposunda güvenli, kontrollü ve belgelerle uyumlu geliştirme yapması için zorunlu çalışma kurallarını tanımlar.

## 2. Önce Okunacak Belgeler
Her geliştirme işi başlamadan önce en az şu dosyalar okunmalıdır:
- `README.md`
- `TORBAA_MASTER_DOKUMAN.md`
- `DEVELOPMENT_ROADMAP.md`
- İlgili `docs/` modül belgesi
- `docs/05_FINANSAL_LEDGER.md`
- `docs/13_ROLLER_VE_YETKILER.md`
- `docs/14_GUVENLIK_MIMARISI.md`

## 3. Genel Kurallar
- Belgeyle çelişen özellik ekleme.
- Yemek kartını TORBAA'nın tamamı gibi konumlandırma.
- Sabit `%5 Toin` veya doğrulanmamış komisyon oranı kullanma.
- Finansal bakiyeyi yalnızca kullanıcı tablosundaki sayı alanıyla yönetme.
- Her finansal hareket ledger üzerinden çalışmalı.
- Hassas veriyi loglama.
- Yetki kontrolünü yalnızca arayüzde bırakma.
- P2P, OCR, şans çarkı ve tedarik pazaryerini MVP'ye ekleme.

## 4. İş Alma Formatı
Her görev şu bilgilerle başlamalıdır:
- Amaç
- Kapsam
- Kapsam dışı
- İlgili belge
- Kabul kriterleri
- Test senaryoları
- Değişecek dosyalar

Belirsiz durumda varsayım yazılmalı ve kritik finansal/hukuki karar kodla sabitlenmemelidir.

## 5. Dal ve PR Kuralı
- Her görev için kısa ömürlü branch aç.
- Küçük ve tek amaçlı commit kullan.
- Ana dala doğrudan commit atma.
- PR açıklamasında ne, neden, test ve risk bölümleri bulunmalı.

## 6. Kod Standartları
- TypeScript strict mode
- Girdi doğrulama
- Açık tipler
- Tekrarlanabilir servis sınırları
- İş kuralları UI bileşenine gömülmemeli
- Para değerleri kuruş bazlı integer veya uygun decimal olmalı
- Tarihler UTC saklanmalı
- Dış servisler adapter arkasında olmalı

## 7. Finansal İşlem Kuralları
- `Idempotency-Key` zorunlu
- Tek veritabanı transaction'ı
- Çift taraflı ledger
- Ters kayıt olmadan finansal kayıt silme yok
- Bakiye eksiye düşemez
- İade toplamı ödeme tutarını aşamaz
- Audit log zorunlu
- Kritik admin işlemi maker-checker gerektirebilir

## 8. Güvenlik Kuralları
- Secret repoya yazılmaz
- OTP ve token açık metin saklanmaz
- MFA kuralları korunur
- Scope bazlı RBAC uygulanır
- Rate limit eklenir
- Hassas alan maskelenir
- Dosya yüklemeleri tip ve boyut kontrolünden geçer

## 9. Test Zorunluluğu
Her özellik için uygun kombinasyon:
- Unit test
- Integration test
- Yetki testi
- Hata ve sınır testi
- Finansal özellikte ledger denge testi
- Kritik kullanıcı akışında E2E testi

Test yazılmadan görev tamamlandı sayılmaz.

## 10. Migration Kuralları
- Migration dosyası üret
- Geriye uyumu kontrol et
- Üretim verisi kaybına yol açma
- Finansal tabloda destructive değişiklik yapma
- Seed verisini demo ile production arasında ayır

## 11. UI/UX Kuralları
- Mobil öncelikli
- Erişilebilir form ve hata mesajları
- Toin ile yemek bakiyesini net ayır
- İşlem öncesi kesinti/kazanım koşullarını göster
- Başarı ekranında tekil işlem referansı göster
- Demo veriyi gerçek işlem gibi sunma

## 12. Görev Tamamlama Raporu
Codex her görev sonunda şunları yazmalıdır:
- Değişen dosyalar
- Uygulanan kabul kriterleri
- Çalıştırılan testler ve sonuçları
- Bilinen eksikler
- Yeni varsayımlar
- Güvenlik veya finansal risk
- Sonraki önerilen görev

## 13. İlk Kodlama Sırası
1. Repo ve kalite altyapısı
2. PostgreSQL/ORM/migration
3. Auth ve RBAC
4. İşletme/şirket çekirdek modelleri
5. Wallet ve ledger
6. QR ödeme intent
7. Toin kampanya motoru
8. İade
9. Hakediş
10. Admin operasyon ekranları
11. Kullanıcı ve işletme ekranları
12. Kurumsal panel

## 14. Kesinlikle Yapılmaması Gerekenler
- Sadece mock/localStorage ile gerçek finansal ürün varmış gibi sunmak
- Ledger olmadan bakiye düşmek
- Yetkisiz kullanıcının başka işletme/şirket verisini görmesi
- Test başarısızken merge önermek
- Hukuki onay bekleyen özelliği canlı kabul etmek
- Belge güncellemeden ürün davranışını değiştirmek
