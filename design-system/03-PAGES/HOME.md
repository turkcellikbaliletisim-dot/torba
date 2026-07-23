# HOME — Ana Sayfa Ekran Standartları

> **Rota:** `/mobile`  
> **Scroll:** Dikey sonsuz scroll  
> **Arka Plan:** `#F7FAFC` (`neutral-50`)  
> **İlkeler:** Kampanya önce gelir; fırsatlar ana ekranın en görünür alanındadır.

---

## 1. Sayfa Bölüm Sıralaması (Section Order)

```text
┌─────────────────────────────────────┐
│  App Bar (Logo + 🔍 Arama + 🔔)      │
├─────────────────────────────────────┤
│  Puan Özet Kartı                    │
│  (250 Puan  ·  Gümüş 🥈 Seviye)     │
├─────────────────────────────────────┤
│  Kampanya Banner Karuseli           │
│  (Hero Slider, 16:9, 20px radius)   │
├─────────────────────────────────────┤
│  Kategori Chip Yatay Scroll         │
│  (Tümü | Yemek | Kafe | Market)    │
├─────────────────────────────────────┤
│  "Yakınındaki Fırsatlar" Bölümü     │
│  (Yatay scroll İşletme Kartları)    │
├─────────────────────────────────────┤
│  "Popüler Kampanyalar" Bölümü       │
│  (Dikey Kampanya Kartı Listesi)     │
├─────────────────────────────────────┤
│  "Öne Çıkan İndirimler"             │
│  (Turuncu #FF6B35 kupon vurguları)  │
├─────────────────────────────────────┤
│  Bottom Navigation (5 Tab)          │
│  [Ana Sayfa | Yakınımda | Cüzdan |  │
│   Puan | Profil]                    │
└─────────────────────────────────────┘
```

---

## 2. Bölüm Detayları

### 2.1 Puan Özet Kartı
- **Düzen:** Açık sarı `#FFF8DE` dolgulu, `#F4B400` kenarlıklı kart
- **İçerik:** `Sparkles` ikonu + "250 Puanın Var" — `H2 Bold`, `#7A5900`
- **Sağ Alan:** "Seviyeni gör →" linki, Puan sayfasına yönlendirir

### 2.2 Kampanya Banner Karuseli
- **Görsel:** Tam genişlik - 40px (20px marjin her iki yanda), `aspect-ratio: 16/9`
- **Radius:** `radius-xl` (20px)
- **Gölge:** `0 6px 20px rgba(16, 33, 43, 0.07)`
- **Auto-play:** 5 saniye aralıkla kayma
- **İçerik:** Kapak görseli + üstte turuncu `#FF6B35` fırsat rozeti + CTA "Kuponu kullan" (#00B7EB)

### 2.3 Yakınındaki Fırsatlar
- **Başlık:** `H3` "Yakınındaki Fırsatlar" + `ChevronRight` "Tümünü gör" Ghost button (#00B7EB)
- **Düzen:** Yatay scroll, her biri 240px genişlikte İşletme Kartı (#FFFFFF kart, 16px radius)
- **İçerik:** Fotoğraf, ad, mesafe ("350m"), puan ("⭐ 4.7"), `#00B7EB` doğrulanmış rozet

### 2.4 Popüler Kampanyalar
- **Düzen:** Dikey liste, her biri Kampanya Kartı (#FFFFFF kart, 16px radius, turuncu indirim oranı)
- **Aradaki Boşluk:** `space-4` (16px)
