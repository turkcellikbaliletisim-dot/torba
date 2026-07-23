# NEARBY — Yakınımda Ekran Standartları

> **Rota:** `/mobile/nearby`  
> **Görünüm Modu:** Harita ↔ Liste toggle  
> **İlke:** Yerellik güçlüdür; yakındaki işletmeler mesafe ve harita bağlamıyla sunulur.

---

## 1. Sayfa Düzeni

```text
┌─────────────────────────────────────┐
│  Arama App Bar                      │
├─────────────────────────────────────┤
│  Kategori Chip Yatay Scroll         │
├─────────────────────────────────────┤
│  Harita / Liste Toggle Butonları    │
├─────────────────────────────────────┤
│                                     │
│  [Harita Görünümü]                  │
│  veya                               │
│  [Liste Görünümü]                   │
│                                     │
├─────────────────────────────────────┤
│  Bottom Navigation (5 Tab)          │
│  [Ana Sayfa | Yakınımda | Cüzdan |  │
│   Puan | Profil]                    │
└─────────────────────────────────────┘
```

---

## 2. Harita Görünümü

- **Harita Kütüphanesi:** Leaflet / Mapbox / Google Maps SDK
- **Tema:** Açık/temiz harita stili (light style)
- **Pin İkonu:** Torba özel marker — Turkuaz (`#00B7EB`) daire üzerinde beyaz konum ikonu
- **Kümeleme (Clustering):** 5+ pin yakınsa turkuaz küme daire + beyaz sayı
- **Pin Tıklama:** Altta mini işletme kartı bottom sheet açılır (fotoğraf, ad, mesafe "350m", puan "4.7", "Detayı gör" #00B7EB)

---

## 3. Liste Görünümü

- **Sıralama:** Mesafeye göre yakından uzağa
- **Kart Tipi:** Yatay İşletme Liste Elemanı (#FFFFFF kart, 16px radius)
- **Mesafe Gösterimi:**
  - `< 1 km:` metre — "350m"
  - `1–10 km:` km — "2.4 km"
  - `> 10 km:` "10 km+"

---

## 4. Filtre Paneli

- **Tetikleyici:** App Bar sağında `Filter` ikonu
- **Açılış:** Bottom Sheet
- **Filtre Seçenekleri:**
  - **Mesafe Slider:** 500m — 1km — 3km — 5km — 10km
  - **Puan:** Min 4+ ⭐
  - **Özellik:** Toggle — "Şu An Açık", "Yemek Kartı Geçerli", "Aktif Kampanyalı"
- **Uygula:** Primary Button `#00B7EB`
