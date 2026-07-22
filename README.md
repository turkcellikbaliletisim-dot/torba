# TORBAA — B2B2C Sadakat, Keşif, Bayi ve Özgün "TORBAA YEMEK KARTI" Ekosistemi

![TORBAA Platform](https://img.shields.io/badge/Platform-TORBAA-00C853?style=for-the-badge&logo=nextdotjs)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_14_|--TypeScript_|--TailwindCSS-007ACC?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active_Development-orange?style=for-the-badge)

---

## 📌 Proje Hakkında

**TORBAA**; üçüncü parti yemek kartı ihraççısı kurumların yüksek komisyon (%10-%12) ve uzun vadeli hakediş yüklerini ortadan kaldırarak **kendi bünyesinde yerli ve özgün "TORBAA YEMEK KARTI" markasını ihraç eden** uçtan uca bir B2B2C sadakat, keşif, e-ticaret ve kurumsal yan haklar platformudur.

### 🌟 Öne Çıkan Değer Önergeleri
1. **Özgün Yemek Kartı İhraççısı (Proprietary Meal Card Issuer)**: TORBAA kendi dijital çipli 16 haneli **TORBAA Yemek Kartı**'nı çıkarır. GVK 23/8 vergi muafiyeti ile %100 uyumludur.
2. **Düşük Komisyon & Hızlı Hakediş (%3-%5)**: Üye restoranlardan rakiplere göre çok daha düşük komisyon alır ve ödemeleri 7 gün içinde işletme hesabına yatırır.
3. **Çift Bakiye Cüzdanı (Dual Wallet)**:
   - 💳 **TORBAA Yemek Kartı Bakiyesi**: Şirket tarafından yüklenen vergi istisnalı net yemek bütçesi.
   - 🪙 **Toin Sadakat Bakiyesi**: Tüm ekosistemde indirim veya hediye çeki olarak kullanılan nakit değerli puan (`1 Toin = 1 TL`).
4. **Çifte Kazanım (Cashback on Meal Spend)**: Çalışanlar TORBAA Yemek Kartı ile yemek ödemesi yaptıklarında harcadıkları tutarın üzerinden ekstra **%5 Toin** kazanmaya devam eder.

---

## 🏗️ Portal ve Uygulama Mimarisi

TORBAA ekosistemi tek bir Next.js 14 projesi altında 3 ana istemci ve portalı barındırır:

| Portal | Rota | Hedef Kitle | Temel İşlevler |
| :--- | :--- | :--- | :--- |
| **Mobil Uygulama** | `/mobile/...` | B2C Tüketici / Şirket Çalışanı | Keşfet, QR Ödeme, TORBAA Yemek Kartı Cüzdanı, Fiş OCR, Şans Çarkı, P2P Transfer |
| **İşletme / Bayi Paneli** | `/panel/...` | Anlaşmalı Restoran & Mağaza | Hızlı POS Kasiyer QR Tahsilatı, Haftalık Hakediş Takibi, B2B Toptan Tedarik Mağazası |
| **Kurumsal İK Portalı** | `/corporate/...` | Şirket İK Yöneticileri | Toplu Yemek Bakiyesi Yükleme, GVK 23/8 Vergi Muafiyet Raporu, Çalışan Prim Modülü |

---

## 📂 Proje Dizin Yapısı

```bash
flow/
├── app/                      # Next.js 14 App Router Sayfaları ve API Rotaları
│   ├── (landing)/            # Ana Karşılama Portalı (/)
│   ├── mobile/               # Mobil B2C / Şirket Çalışanı Uygulaması
│   ├── panel/                # İşletme / Bayi Yönetim Paneli
│   ├── corporate/            # Kurumsal Şirket İK Yönetim Portalı
│   ├── api/                  # Mock/Real REST API Endpoint'leri
│   └── globals.css           # Tasarım Sistemi & Tailwind Temel Stilleri
├── lib/                      # Mock Data Store, Helpers & Utility Servisleri
├── types/                    # TypeScript Veri Modelleri & Şemaları
├── references/               # Orijinal Şartnameler ve Sunum PDF'leri
├── TORBAA_MASTER_DOKUMAN.md  # Ana Proje Spesifikasyonu ve İş Kuralları
├── OPEN_QUESTIONS.md         # Açık Kararlar ve Teknik/Hukuki Belirsizlikler
├── DEVELOPMENT_ROADMAP.md    # Codex / AI Geliştirme Görev Sıralaması
├── package.json
└── README.md
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### Kurulum

1. Depoyu klonlayın veya dizine gidin:
```bash
cd /Users/ikbal/Desktop/flow
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda açın:
- **Karşılama Sayfası**: `http://localhost:3000`
- **Mobil Uygulama**: `http://localhost:3000/mobile/explore`
- **İşletme Paneli**: `http://localhost:3000/panel/dashboard`
- **Kurumsal İK Portalı**: `http://localhost:3000/corporate/dashboard`

---

## 📝 Dokümantasyon Belgeleri

- 📄 [TORBAA_MASTER_DOKUMAN.md](file:///Users/ikbal/Desktop/flow/TORBAA_MASTER_DOKUMAN.md): Tam iş kuralları, çift bakiye mantığı, vergi istisnası ve veri modelleri.
- ❓ [OPEN_QUESTIONS.md](file:///Users/ikbal/Desktop/flow/OPEN_QUESTIONS.md): Hukuki, finansal ve teknik açık noktalar.
- 🗺️ [DEVELOPMENT_ROADMAP.md](file:///Users/ikbal/Desktop/flow/DEVELOPMENT_ROADMAP.md): Adım adım geliştirme ve AI görev haritası.

---

## 📜 Lisans

Tüm hakları **TORBAA Teknolojileri A.Ş.**'ye aittir. İzinsiz kopyalanamaz veya dağıtılamaz.