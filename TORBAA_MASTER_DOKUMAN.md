# TORBAA — Master Proje Spesifikasyon Dokümanı

> **Sürüm:** 3.0  
> **Tarih:** 22 Temmuz 2026  
> **Durum:** Ürün temeli / doğrulama aşaması

## 1. Ürün tanımı

TORBAA; kullanıcıları çevresindeki işletmeler, kampanyalar ve avantajlarla buluşturan; işletmelerin müşterilerini tekrar kazanmasını, satışlarını artırmasını ve dijital sadakat programlarını yönetmesini sağlayan B2B2C sadakat, keşif ve yerel ticaret platformudur.

TORBAA Yemek Kartı, platformun kurumsal şirketler, çalışanlar ve yemek işletmeleri için sunduğu güçlü ana ürünlerden biridir; ancak TORBAA'nın tamamı değildir. Ana ekosistem restoranların yanında kafe, market, teknoloji, giyim, güzellik ve diğer yerel işletme kategorilerini kapsar.

## 2. Ürün ilkeleri

1. TORBAA'nın ana işi, müşteriyi işletmeye geri getiren sadakat ve keşif altyapısıdır.
2. Yemek kartı, düzenli kullanım ve yüksek işlem sıklığı oluşturan kurumsal yan hak ürünüdür.
3. Yemek bakiyesi ve Toin aynı cüzdan içinde gösterilebilir fakat ayrı hesap, kural ve muhasebe defterlerinde tutulur.
4. İşletmelerden gizli ücret alınmaz; komisyon, kesinti, net hakediş ve ödeme tarihi önceden gösterilir.
5. Kesin komisyon ve Toin oranları finansal model doğrulanmadan kod içine sabitlenmez.
6. Finansal hareketler silinmez; iptal ve iadeler ters muhasebe kaydıyla işlenir.
7. P2P Toin transferi, OCR, şans çarkı ve hediye çeki pazarı MVP dışıdır.
8. Gerçek para işlemleri lisanslı iş ortağı ve hukuki değerlendirme tamamlanmadan aktif edilmez.

## 3. Ürün ailesi

### 3.1 TORBAA Keşfet
- Konum ve kategori bazlı işletme keşfi
- Kampanya ve fırsat listeleri
- Favoriler, harita ve işletme profilleri
- Kişiselleştirilmiş öneriler için ileride veri altyapısı

### 3.2 TORBAA Toin
- Harcama veya görev karşılığı sadakat puanı
- İşletme, şirket veya TORBAA tarafından fonlanabilen kampanyalar
- İade halinde geri alma
- Süre, limit, kampanya bütçesi ve kötüye kullanım kontrolü
- Yemek bakiyesinden tamamen ayrı ledger

### 3.3 TORBAA Yemek Kartı
- Kurumsal şirketten çalışan hesabına yemek bütçesi yükleme
- İzin verilen işletme ve kategori kontrolü
- Dinamik QR ile ödeme
- Komisyon, hakediş, iade ve mutabakat
- En düşük toplam maliyet ve fiyat koruma stratejisi

### 3.4 TORBAA İşletme
- Başvuru ve belge yönetimi
- Şube, kasiyer ve yetki yönetimi
- Kampanya oluşturma
- QR işlem kabulü
- İşlem, iade, hakediş ve raporlama
- Müşteri ve tekrar ziyaret analitiği

### 3.5 TORBAA Kurumsal
- Şirket, çalışan, departman ve maliyet merkezi yönetimi
- Toplu yükleme ve onay akışları
- Fatura, ödeme ve kullanım raporları
- Çalışan kartını askıya alma ve işten ayrılma işlemleri

### 3.6 TORBAA Admin
- Kullanıcı, şirket, işletme ve şube yönetimi
- Komisyon, hakediş ve Toin kuralları
- Kampanya onayı
- İade, itiraz, risk ve destek süreçleri
- Rol, yetki, audit log ve sistem ayarları

### 3.7 TORBAA Tedarik
- İşletmelere yönelik sarf ve toptan ürün pazaryeri
- MVP sonrası fazda geliştirilecektir

## 4. Roller

- **Tüketici:** Keşfeder, kampanya kullanır, Toin kazanır ve harcar.
- **Şirket çalışanı:** Tüketici özelliklerine ek olarak yemek bakiyesi kullanır.
- **İşletme sahibi:** İşletme, şube, kampanya, işlem ve hakediş yönetir.
- **Şube yöneticisi:** Yetkili olduğu şubeleri ve personeli yönetir.
- **Kasiyer:** Sadece ödeme oluşturma, doğrulama ve yetkili iade aksiyonlarına erişir.
- **Kurumsal yönetici:** Şirket sözleşmesi, çalışan ve bütçe yönetir.
- **İK/finans kullanıcısı:** Yetkisine göre çalışan, yükleme, fatura ve rapor ekranlarına erişir.
- **TORBAA operasyon:** Başvuru, belge, destek ve içerik süreçlerini yönetir.
- **TORBAA finans:** Mutabakat, komisyon, hakediş, iade ve finansal raporlamayı yönetir.
- **TORBAA risk yöneticisi:** Şüpheli işlem, limit ve hesap kısıtlama işlemlerini yönetir.
- **Süper admin:** Sistem ayarları ve rol politikalarını yönetir.

## 5. Cüzdan ve hesap mimarisi

Kullanıcı arayüzünde tek cüzdan bulunabilir ancak minimum şu hesaplar ayrı tutulur:

- Kullanıcı yemek bakiyesi hesabı
- Kullanıcı Toin hesabı
- Kurumsal şirket fonlama hesabı
- İşletme bekleyen hakediş hesabı
- İşletme ödenebilir hakediş hesabı
- TORBAA komisyon geliri hesabı
- Kampanya bütçesi hesabı
- İade ve ters işlem hesabı
- Bekleyen/şüpheli işlem hesabı

Bakiye alanları yalnızca hızlı okuma için türetilmiş değer olabilir. Finansal doğruluğun kaynağı değiştirilemez ledger kayıtlarıdır.

## 6. Toin ekonomisi

- `1 Toin = 1 TL` kararı kesinleşmiş finansal kural değildir; iş modeli ve hukuki değerlendirme sonrası onaylanacaktır.
- Standart kazanım oranı kod içine `%5` olarak yazılmayacaktır.
- Başlangıç varsayımı, sürdürülebilir finansal modele göre düşük taban oran ve kampanya katkısıdır.
- Kampanyanın finansman kaynağı kayıt altına alınır: işletme, kurumsal şirket veya TORBAA.
- Günlük, aylık ve kampanya bazlı limit uygulanır.
- İade ve ters işlemde daha önce verilen Toin geri alınır.
- Eksi Toin bakiyesi, bloke veya sonraki kazanımlardan tahsil politikası ayrıca belirlenir.

## 7. Yemek kartı fiyat stratejisi

TORBAA'nın iddiası tek başına düşük komisyon değil, **en düşük toplam işletme maliyeti** olacaktır.

Toplam maliyet karşılaştırmasına şunlar dahil edilir:

- işlem komisyonu,
- cihaz veya uygulama bedeli,
- kurulum,
- bakım ve teknik destek,
- erken ödeme kesintisi,
- banka transferi,
- aylık üyelik,
- zorunlu kampanya katkısı,
- diğer sözleşmesel kesintiler.

Planlanan paketler:

- **Standart:** En düşük maliyet, standart hakediş süresi
- **Hızlı:** Daha kısa hakediş, açıkça gösterilen farklı fiyat
- **Sabit paket:** Belirli hacme kadar düşük veya sıfır işlem komisyonu karşılığında aylık paket
- **Kurumsal/zincir:** Hacim ve entegrasyona göre özel teklif

Kesin oranlar, ödeme ortağı maliyeti ve pilot verileri doğrulanmadan yayınlanmaz.

## 8. Temel iş akışları

### 8.1 İşletme katılımı
Başvuru → belge yükleme → yetkili ve IBAN doğrulama → risk kontrolü → sözleşme → admin onayı → şube/kasiyer kurulumu.

### 8.2 Kurumsal şirket katılımı
Başvuru → şirket ve yetkili doğrulama → sözleşme → ödeme/fonlama yöntemi → çalışan aktarımı → yükleme onayı → kullanım.

### 8.3 Sadakat işlemi
İşletme/kampanya doğrulama → işlem tutarı → ödül kuralı → bütçe ve limit kontrolü → ledger kayıtları → kullanıcı bildirimi.

### 8.4 Yemek kartı ödemesi
Dinamik QR → kasiyer/şube doğrulama → kullanıcı onayı → bakiye ve kategori kontrolü → idempotency kontrolü → çift taraflı ledger → işlem sonucu → hakediş planı.

### 8.5 İade
Orijinal işlem doğrulama → yetki ve süre kontrolü → tam/kısmi iade → ters ledger kayıtları → Toin geri alma → hakediş düzeltmesi → bildirim.

### 8.6 Hakediş
Uygun işlemler → komisyon hesaplama → risk/bloke kontrolü → mutabakat → ödeme dosyası veya iş ortağı talimatı → banka sonucu → ledger kapanışı.

## 9. MVP kapsamı

### Dahil
- Kullanıcı ve işletme kayıt akışları
- Keşfet ve işletme profili
- Kampanya oluşturma ve listeleme
- QR ile Toin kazanma/harcama prototipi
- İşletme paneli
- Admin paneli
- Rol ve yetki altyapısı
- Audit log
- Ledger tasarımı ve test ortamı
- Kurumsal şirket ve yemek kartı akışlarının kontrollü pilot altyapısı

### MVP dışı
- P2P Toin transferi
- Şans çarkı
- OCR fiş kampanyası
- Hediye çeki pazarı
- Tedarik pazaryeri
- Kendi ödeme kuruluşu lisansı
- Fiziksel POS zorunluluğu

## 10. Portal rotaları

### Mobil
`/mobile/login`, `/mobile/explore`, `/mobile/merchant/[id]`, `/mobile/campaigns`, `/mobile/qr`, `/mobile/wallet`, `/mobile/transactions`, `/mobile/profile`, `/mobile/support`

### İşletme
`/panel/onboarding`, `/panel/dashboard`, `/panel/branches`, `/panel/cashiers`, `/panel/campaigns`, `/panel/transactions`, `/panel/refunds`, `/panel/settlements`, `/panel/bank-account`, `/panel/reports`, `/panel/support`, `/panel/settings`

### Kurumsal
`/corporate/onboarding`, `/corporate/dashboard`, `/corporate/employees`, `/corporate/departments`, `/corporate/allowances`, `/corporate/approvals`, `/corporate/invoices`, `/corporate/reports`, `/corporate/settings`

### Admin
`/admin/dashboard`, `/admin/users`, `/admin/merchants`, `/admin/companies`, `/admin/transactions`, `/admin/refunds`, `/admin/settlements`, `/admin/campaigns`, `/admin/rewards`, `/admin/risk`, `/admin/support`, `/admin/audit`, `/admin/settings`

## 11. Teknik zorunluluklar

- PostgreSQL ve migration sistemi
- Çift taraflı, değiştirilemez finansal ledger
- Idempotency key
- Dinamik ve süreli QR
- Rol tabanlı erişim kontrolü
- Audit log
- Hassas veri şifreleme ve maskeleme
- Rate limiting
- İşlem limitleri ve risk kuralları
- Kuyruk tabanlı bildirim ve hakediş işleme
- Test, staging ve production ayrımı
- Otomatik yedekleme ve felaket kurtarma planı

## 12. Başarı ölçütleri

- Aktif kullanıcı ve işletme sayısı
- Kullanıcı başına aylık işlem sıklığı
- Tekrar ziyaret oranı
- Kampanya dönüşüm oranı
- İşletme başına işlem hacmi
- Ortalama toplam işletme maliyeti
- Hakediş süresi ve zamanında ödeme oranı
- Toin yükümlülüğü ve kullanım oranı
- Sahtecilik/itiraz oranı
- Kurumsal müşteri devamlılığı

Detaylı kararlar `docs/` klasöründe, henüz kesinleşmemiş konular `OPEN_QUESTIONS.md` dosyasında tutulur.
