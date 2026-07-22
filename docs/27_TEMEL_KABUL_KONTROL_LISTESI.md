# TORBAA Temel Kabul Kontrol Listesi

Bu kontrol listesi, ürün temel dokümantasyonunun kod geliştirmeye başlamadan önce yeterli olup olmadığını doğrular.

## 1. Ürün Tanımı
- [x] TORBAA'nın ana işi açıkça tanımlandı.
- [x] Yemek kartının ekosistemdeki yeri tanımlandı.
- [x] Kullanıcı, işletme, kurumsal şirket ve admin değer önerileri ayrıldı.
- [x] MVP kapsamı ve MVP dışı özellikler belirlendi.

## 2. Finansal Model
- [x] Toin ve yemek bakiyesi ayrı hesaplar olarak tanımlandı.
- [x] Ledger ve ters kayıt zorunluluğu tanımlandı.
- [x] Komisyon, hakediş ve iade prensipleri belirlendi.
- [x] Birim ekonomi ve kampanya bütçesi yaklaşımı tanımlandı.
- [ ] Kesin Toin değer denkliği uzman onayı aldı.
- [ ] Kesin komisyon ve hakediş paketleri ticari olarak onaylandı.

## 3. Hukuk ve Uyum
- [x] KVKK, sözleşme, saklama ve veri sahibi hakları kapsamı yazıldı.
- [x] Lisanslı iş ortağı ve kapalı devre seçenekleri açık karar olarak kaydedildi.
- [x] Pazarlama izinleri işlemsel bildirimlerden ayrıldı.
- [ ] Ödeme/yemek kartı modeli hukuk görüşüyle doğrulandı.
- [ ] Vergi ve muhasebe akışı mali müşavir görüşüyle doğrulandı.

## 4. Ürün Portalları
- [x] Mobil uygulama kapsamı tanımlandı.
- [x] İşletme paneli kapsamı tanımlandı.
- [x] Kurumsal panel kapsamı tanımlandı.
- [x] Admin paneli kapsamı tanımlandı.
- [x] Her portal için güvenlik ve kabul kriterleri yazıldı.

## 5. Teknik Temel
- [x] Veritabanı şeması tanımlandı.
- [x] API sözleşmeleri tanımlandı.
- [x] Rol ve yetki modeli tanımlandı.
- [x] Güvenlik mimarisi tanımlandı.
- [x] Teknik mimari ve modül sınırları tanımlandı.
- [x] DevOps, deployment ve rollback yaklaşımı tanımlandı.
- [x] Bildirim, operasyon ve destek süreçleri tanımlandı.

## 6. Kalite ve Test
- [x] Unit, entegrasyon, uçtan uca, güvenlik ve yük testleri tanımlandı.
- [x] Finansal invariants ve mutabakat testleri tanımlandı.
- [x] Pilot başarı ve durdurma kriterleri tanımlandı.
- [x] KPI ve raporlama sistemi tanımlandı.

## 7. Geliştirme Yönetimi
- [x] Codex geliştirme talimatı hazırlandı.
- [x] Her görevin ayrı branch ve PR olması kuralı yazıldı.
- [x] Migration ve test zorunlulukları yazıldı.
- [x] Doküman indeksi ve kaynak önceliği belirlendi.
- [x] Ortak terimler sözlüğü hazırlandı.
- [x] Karar kayıt sistemi oluşturuldu.

## 8. Kodlamaya Başlama Kapısı
Aşağıdaki koşullar sağlandığında ilk kod PR'ı açılabilir:
- [x] Ürün ve teknik temel dokümanları tamamlandı.
- [x] Açık kararlar koddan ayrıştırıldı.
- [x] Finansal ledger üretim kodundan önce tasarlandı.
- [x] İlk geliştirme fazı veri, migration, auth ve ledger olarak belirlendi.

Gerçek para veya yemek kartı pilotu için ayrıca:
- [ ] Hukuki model onayı
- [ ] Ödeme ortağı sözleşmesi/sandbox erişimi
- [ ] Finansal model onayı
- [ ] Güvenlik testi
- [ ] Operasyon sorumluları
- [ ] Mutabakat ve olay müdahale provası
zorunludur.

## Sonuç
Ürün temeli, kontrollü teknik geliştirmeyi başlatmak için yeterlidir. Ancak gerçek para hareketi ve ticari pilot, yukarıdaki uzman ve iş ortağı onayları tamamlanmadan açılmamalıdır.
