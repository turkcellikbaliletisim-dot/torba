# UI_PROMPTS — AI Ekran Üretme Prompt Kalıpları

> **Amaç:** Cursor, Codex, Claude veya Gemini gibi AI kod ajanlarına Torba mobil veya panel ekranları ürettirmek için optimize edilmiş prompt şablonları.

---

## 1. Genel Ekran Üretme Prompt Şablonu

```
Torba mobil uygulaması için [EKRAN ADI] ekranını oluştur.

Teknoloji: [React Native / Flutter / Next.js + TailwindCSS]
Tema: Light Mode öncelikli (zemin: #F7FAFC neutral-50, kart: #FFFFFF white, ana renk: #00B7EB brand-500)
Kampanya rengi: #FF6B35 (Turuncu), Puan rengi: #F4B400 (Sarı)
Tasarım Sistemi: design-system/ klasöründeki token ve bileşen standartlarını kullan.
Font: Inter
Yatay sayfa boşluğu: 20px (space-5)

Ekranın bölümleri:
1. [Bölüm 1 açıklaması]
2. [Bölüm 2 açıklaması]
3. [Bölüm 3 açıklaması]

Özel kurallar:
- Fırsat, keşif ve sadakat vurgusu ön planda olmalı, finans uygulaması gibi görünmemeli.
- Tüm tıklanabilir alanlar minimum 44x44 px touch target olmalı.
- Skeleton shimmer loading state ekle.
- Mikro metinler kısa ve doğrudan olmalı ("250 puan kazan", "Kuponu kullan").
```

---

## 2. Spesifik Ekran Promptları

### 2.1 Ana Sayfa
```
Torba Ana Sayfa ekranını oluştur. Üstte logo ve arama çubuğu, altında kampanya banner karuseli (16:9, auto-play, 20px radius), kategori chip yatay scroll, "Yakınındaki Fırsatlar" yatay scroll işletme kartları (16px radius, #00B7EB doğrulanmış rozeti), "Popüler Kampanyalar" dikey liste. Bottom navigation 5 tab (Ana Sayfa, Yakınımda, Cüzdan, Puan, Profil). Zemin #F7FAFC, kartlar #FFFFFF.
```

### 2.2 Cüzdan
```
Torba Cüzdan ekranını oluştur. Sayfa başlığı "Cüzdanım". Üstte kullanılabilir avantajlar ve kupon özet kartı. Altında 3 tab: Kuponlarım / Üyelik Kartlarım / Kullanılabilir Fırsatlar. Kupon kartlarında 16px radius, kesikli bilet çizgisi efekti, "Kuponu kullan" #00B7EB turkuaz CTA butonu. Zemin #F7FAFC, kartlar #FFFFFF.
```

### 2.3 Puan (Toin Puan)
```
Torba Puan ekranını oluştur. Sayfa başlığı "Puanlarım". Üstte #F4B400 sarı bakiye kartı ("1.250 Puan", seviye durumu: Gümüş 🥈, progress bar). Altında rozet galerisi (ilk alışveriş, streak, referans). Alt tab: Geçmiş / Nasıl Kazanırım. İşlem geçmişinde yeşil +kazanım, kırmızı -harcama liste elemanları.
```
