# TORBAA — Sadakat, Keşif, Yerel Ticaret ve Yemek Kartı Ekosistemi

![TORBAA Platform](https://img.shields.io/badge/Platform-TORBAA-00C853?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_14_|_TypeScript_|_TailwindCSS-007ACC?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Product_Foundation-orange?style=for-the-badge)

## Proje hakkında

**TORBAA**, kullanıcıları çevresindeki işletmeler, kampanyalar ve avantajlarla buluşturan; işletmelerin müşterilerini tekrar kazanmasını, satışlarını artırmasını ve kendi dijital sadakat programlarını yönetmesini sağlayan B2B2C yerel ticaret platformudur.

Platformun ana omurgası:

- yerel işletme keşfi,
- kampanya ve sadakat yönetimi,
- Toin ödül sistemi,
- QR tabanlı işlem doğrulama,
- işletme büyüme araçları,
- kurumsal yan haklar,
- TORBAA Yemek Kartı,
- ilerleyen fazlarda işletmelere yönelik tedarik pazaryeridir.

**TORBAA Yemek Kartı platformun tamamı değil, güçlü ana ürünlerinden biridir.** Kurumsal şirketler çalışanlarına yemek bakiyesi yükleyebilir; çalışanlar bu bakiyeyi anlaşmalı yemek işletmelerinde kullanabilir. TORBAA'nın yemek kartı iddiası, yalnızca düşük komisyon değil, **en düşük toplam maliyet, gizli ücret olmaması, cihaz zorunluluğu bulunmaması ve şeffaf hakediş** üzerine kurulacaktır.

## Ürün ailesi

| Ürün | Hedef kitle | Temel değer |
|---|---|---|
| **TORBAA Keşfet** | Tüketiciler | Yakındaki işletmeleri, kampanyaları ve fırsatları keşfetme |
| **TORBAA Toin** | Tüketiciler ve işletmeler | Harcamayı tekrar ziyarete dönüştüren sadakat altyapısı |
| **TORBAA Yemek Kartı** | Şirketler, çalışanlar ve restoranlar | Şeffaf, düşük toplam maliyetli kurumsal yemek çözümü |
| **TORBAA İşletme** | Yerel esnaf ve zincir işletmeler | Kampanya, müşteri, şube, kasiyer, işlem ve hakediş yönetimi |
| **TORBAA Kurumsal** | Şirketler ve İK ekipleri | Çalışan, bütçe, yükleme, onay ve raporlama yönetimi |
| **TORBAA Admin** | TORBAA operasyon ekibi | Platform, finans, risk, destek ve içerik yönetimi |
| **TORBAA Tedarik** | İşletmeler | Sarf malzemesi ve toptan tedarik pazaryeri |

## Temel ilkeler

1. **Sadakat önce gelir:** TORBAA'nın ana işi müşteriyi işletmeye geri getirmektir.
2. **Yemek kartı ekosisteme trafik sağlar:** Kurumsal kullanım, TORBAA işletme ağını ve kullanıcı sıklığını büyütür.
3. **Toin ayrı bir sadakat varlığıdır:** Yemek bakiyesi ile aynı cüzdanda görünse de finansal olarak ayrı hesaplarda tutulur.
4. **Gizli ücret yoktur:** İşletme, işlemden önce komisyonu, kesintiyi, net hakedişi ve ödeme tarihini görür.
5. **Finansal hareketler silinmez:** İptal ve iadeler ters kayıtla işlenir.
6. **Mevzuat iddiaları doğrulanmadan kesinleştirilmez:** Vergi, ödeme ve lisans kapsamları hukuk ve finans uzmanı onayına tabidir.

## Portal mimarisi

| Portal | Rota | Hedef kitle |
|---|---|---|
| Mobil uygulama | `/mobile/...` | Tüketici ve şirket çalışanı |
| İşletme paneli | `/panel/...` | İşletme sahibi, şube yöneticisi, kasiyer |
| Kurumsal panel | `/corporate/...` | Şirket yöneticisi, İK ve finans ekipleri |
| Admin panel | `/admin/...` | TORBAA operasyon, finans, risk ve destek ekipleri |

## Repo yapısı

```text
torba/
├── app/                       # Next.js App Router
│   ├── mobile/
│   ├── panel/
│   ├── corporate/
│   ├── admin/
│   └── api/
├── components/
├── lib/
├── types/
├── docs/                      # Ürün ve teknik karar belgeleri
├── references/                # Eski dokümanlar ve sunumlar
├── TORBAA_MASTER_DOKUMAN.md
├── OPEN_QUESTIONS.md
├── DEVELOPMENT_ROADMAP.md
└── README.md
```

## Hızlı başlangıç

```bash
git clone https://github.com/turkcellikbaliletisim-dot/torba.git
cd torba
npm install
npm run dev
```

## Dokümantasyon

- [Master proje dokümanı](./TORBAA_MASTER_DOKUMAN.md)
- [Geliştirme yol haritası](./DEVELOPMENT_ROADMAP.md)
- [Açık kararlar](./OPEN_QUESTIONS.md)
- [Ana iş modeli](./docs/01_TORBAA_ANA_IS_MODELI.md)
- [Toin ekonomisi](./docs/02_TOIN_EKONOMISI.md)
- [Yemek kartı fiyat stratejisi](./docs/03_YEMEK_KARTI_FIYAT_STRATEJISI.md)
- [Komisyon ve hakediş](./docs/04_KOMISYON_VE_HAKEDIS.md)
- [Finansal ledger mimarisi](./docs/05_FINANSAL_LEDGER.md)

## Durum

Bu repo şu anda ürün temeli ve kontrollü prototip aşamasındadır. Gerçek para, hakediş veya yemek kartı işlemleri; lisanslı iş ortağı, mevzuat değerlendirmesi, güvenlik testleri ve çift taraflı finansal defter tamamlanmadan canlıya alınmayacaktır.

## Lisans

Tüm hakları saklıdır. Şirket ve marka unvanı kesinleştiğinde lisans metni güncellenecektir.
