# BUSINESS_DETAIL — İşletme Detay Ekranı

> **Rota:** `/mobile/merchant/[id]`  
> **App Bar:** Şeffaf overlay → Scroll'da opak geçiş

---

## 1. Sayfa Düzeni

```text
┌─────────────────────────────────────┐
│  [Kapak Görseli — Full Width 16:9]  │
│  ← Geri   ♥ Favori   ↗ Paylaş      │
├─────────────────────────────────────┤
│  İşletme Bilgi Kartı (#FFFFFF)      │
│  Logo (64px)  İşletme Adı (H1)     │
│  ⭐ 4.7 (324 değerlendirme)        │
│  📍 Restoran · 350m · Açık         │
│  ✓ Doğrulanmış İşletme (#00B7EB)   │
├─────────────────────────────────────┤
│  Hızlı Aksiyon Butonları (3'lü)    │
│  [📞 Ara] [🗺 Yol Tarifi] [🏷 Fırsatlar]│
├─────────────────────────────────────┤
│  Tab Çubuğu                        │
│  [Kampanyalar | Menü | Yorumlar]    │
├─────────────────────────────────────┤
│  Seçili Tab İçeriği                 │
├─────────────────────────────────────┤
│  Bottom Navigation (5 Tab)          │
└─────────────────────────────────────┘
```

---

## 2. Kapak & Kart Özellikleri

- **Kapak Görseli:** Canlı, doğal işletme fotoğrafı (16:9)
- **Doğrulanmış Rozet:** `#00B7EB` turkuaz tik ikonu + "Doğrulanmış İşletme"
- **Aktif Kampanyalar Tab:** Kampanya Kartı listesi (turuncu `#FF6B35` fırsat etiketli)
- **Aksiyonlar:** `#F1FBFE` (`brand-50`) dairesel butonlar, `#007DA3` ikonlar
