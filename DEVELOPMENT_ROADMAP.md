# TORBAA — Geliştirme Yol Haritası

Bu yol haritası görsel demo üretmekten önce ürün, finans, güvenlik ve operasyon temelini kurar. Görevler onay sırasına göre ilerletilmelidir.

## Faz 0 — Ürün kararları ve doğrulama

- [x] TORBAA'nın ana işini sadakat, keşif ve yerel ticaret olarak tanımla.
- [x] Yemek kartını ekosistemin güçlü ana ürünü olarak konumlandır.
- [x] Eski FLOW belgelerini repodan temizle.
- [x] Toin ekonomisi ve kullanım prensiplerini dokümante et.
- [ ] Toin değer denkliğini hukuk ve finans uzmanıyla kesinleştir.
- [ ] Yemek kartı iş ortaklığı/lisans modelini hukuk ve finans uzmanıyla doğrula.
- [ ] Ödeme kuruluşu adayları ve maliyet kalemlerini karşılaştır.
- [x] Balıkesir pilot taslağını ve hedeflerini dokümante et.
- [ ] Pilot işletme ve kurumsal şirket adaylarını kesinleştir.

## Faz 1 — Ürün ve teknik spesifikasyon

- [x] Roller ve yetki matrisi
- [x] Mobil uygulama kapsamı ve kabul kriterleri
- [x] İşletme paneli kapsamı ve kabul kriterleri
- [x] Kurumsal panel kapsamı ve kabul kriterleri
- [x] Admin paneli kapsamı ve kabul kriterleri
- [x] Toin ekonomi ve kural prensipleri
- [x] Yemek kartı fiyat ve paket modeli
- [x] Komisyon ve hakediş modeli
- [x] İade, itiraz ve ters işlem kuralları
- [x] KVKK, sözleşme ve veri saklama gereksinimleri
- [x] Veritabanı şeması
- [x] API sözleşmeleri
- [x] Güvenlik mimarisi
- [x] Test planı
- [x] DevOps ve deployment yaklaşımı
- [x] Operasyon, destek ve KPI sistemi
- [x] Codex geliştirme talimatı

**Çıkış kriteri:** Ürün ve teknik temel belgeleri çapraz kontrol edilmiş, açık kararlar ayrı listelenmiş ve geliştirme ajanı için tek doküman indeksi hazırlanmış olmalıdır.

## Faz 2 — Veri, ledger ve güvenlik temeli

- [ ] PostgreSQL ve migration altyapısını kur.
- [ ] Kullanıcı, şirket, işletme, şube, kasiyer ve rol tablolarını oluştur.
- [ ] Çift taraflı finansal ledger tablolarını oluştur.
- [ ] Yemek bakiyesi ve Toin hesaplarını ayır.
- [ ] Idempotency altyapısını oluştur.
- [ ] Dinamik, imzalı ve süreli QR token yapısını oluştur.
- [ ] Audit log ve güvenlik olay kayıtlarını oluştur.
- [ ] Limit ve risk kural motorunun temelini kur.
- [ ] Test verisi, fixture ve seed sistemi oluştur.

**Çıkış kriteri:** Aynı finansal istek iki kez gönderildiğinde tek işlem oluşmalı; iade ters ledger kaydı üretmeli; bütün yönetici aksiyonları loglanmalıdır.

## Faz 3 — Kimlik doğrulama ve yetkilendirme

- [ ] Telefon/SMS OTP giriş akışı
- [ ] Güvenli oturum ve token yenileme
- [ ] Rol tabanlı erişim kontrolü
- [ ] Admin ve finans kullanıcıları için iki aşamalı doğrulama
- [ ] Cihaz, IP ve rate limit kontrolleri
- [ ] Hesap askıya alma ve oturum iptali

## Faz 4 — Sadakat MVP

- [ ] Mobil giriş ve profil
- [ ] Keşfet, kategori, arama ve işletme detayı
- [ ] Kampanya listesi ve kampanya detayları
- [ ] İşletme başvurusu ve admin onayı
- [ ] İşletme/şube/kasiyer yönetimi
- [ ] QR ile Toin kazanma
- [ ] Toin harcama
- [ ] Kampanya bütçesi ve limit kontrolü
- [ ] İade halinde Toin geri alma
- [ ] İşletme ve admin raporları

**MVP dışı:** P2P transfer, şans çarkı, OCR, hediye çeki ve tedarik pazaryeri.

## Faz 5 — Admin ve operasyon merkezi

- [ ] Admin dashboard
- [ ] Kullanıcı, işletme, şirket ve şube yönetimi
- [ ] Belge ve başvuru onayı
- [ ] Kampanya onayı ve Toin kural yönetimi
- [ ] İşlem, iade ve itiraz yönetimi
- [ ] Riskli işlem kuyruğu
- [ ] Destek talepleri
- [ ] Audit log görüntüleme
- [ ] Sistem parametreleri ve özellik bayrakları

## Faz 6 — Kurumsal ve yemek kartı pilotu

- [ ] Kurumsal şirket başvurusu ve sözleşme akışı
- [ ] Çalışan ekleme ve Excel aktarımı
- [ ] Departman ve maliyet merkezi
- [ ] Bakiye yükleme talebi ve çift onay
- [ ] Ödeme ortağı sandbox entegrasyonu
- [ ] Yemek işletmesi kategori kontrolü
- [ ] Yemek kartı QR ödeme
- [ ] Tam ve kısmi iade
- [ ] Komisyon hesaplama
- [ ] Bekleyen/ödenebilir hakediş
- [ ] Mutabakat ve ödeme sonucu işleme
- [ ] Kurumsal ve işletme raporları

**Çıkış kriteri:** Pilot işlemler baştan sona ödeme ortağı sandbox ortamında mutabık olmalıdır.

## Faz 7 — Fiyat ve hakediş avantajı

- [ ] Toplam maliyet hesaplayıcısı
- [ ] Standart, hızlı ve sabit paketler
- [ ] Fiyat koruma başvuru akışı
- [ ] Rakip teklif karşılaştırma ekranı
- [ ] Hakediş takvimi
- [ ] Kesinti ve net ödeme şeffaflığı
- [ ] Zincir işletme özel fiyatlandırması

## Faz 8 — Test, güvenlik ve pilot

- [ ] Unit ve entegrasyon testleri
- [ ] Finansal invariants testleri
- [ ] Playwright uçtan uca testleri
- [ ] Yük ve eşzamanlılık testleri
- [ ] Sızma testi
- [ ] Yedekleme ve geri dönüş testi
- [ ] Operasyon runbook'ları
- [ ] Balıkesir pilot işletme ve şirket onboarding'i
- [ ] Pilot KPI ve finansal sonuç değerlendirmesi

## Faz 9 — Büyüme modülleri

- [ ] Tedarik pazaryeri
- [ ] ERP/bordro entegrasyonları
- [ ] Android POS uygulaması
- [ ] Gelişmiş kişiselleştirme
- [ ] Hediye çeki pazarı
- [ ] Kontrollü oyunlaştırma
- [ ] Yeni şehirler ve zincir işletmeler

## Codex çalışma kuralı

Her görev ayrı branch ve PR olarak geliştirilmelidir. Bir PR yalnızca tek iş alanını kapsamalı; build, lint ve ilgili testler çalışmadan bir sonraki göreve geçilmemelidir. Finansal kurallar için mock davranış ile production davranışı açıkça ayrılmalıdır.
