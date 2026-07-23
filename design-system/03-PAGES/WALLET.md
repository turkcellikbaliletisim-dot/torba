# WALLET — Cüzdan Ekran Standartları

> **Rota:** `/mobile/wallet`  
> **App Bar:** Pinned — "Cüzdanım"  
> **İlke:** Cüzdan sade olmalıdır; kuponlar, üyelik kartları ve kullanılabilir avantajlar tek yerde tutulur.

---

## 1. Sayfa Düzeni

```text
┌─────────────────────────────────────┐
│  App Bar "Cüzdanım"                │
├─────────────────────────────────────┤
│  Kullanılabilir Avantajlar Özet Kartı│
│  (3 Kupon  ·  1 Üyelik Kartı)       │
├─────────────────────────────────────┤
│  Tab Çubuğu                        │
│  [Kuponlarım | Kartlarım | Fırsatlar]│
├─────────────────────────────────────┤
│  Seçili Tab İçeriği                 │
│  • Kuponlarım: Aktif indirim kuponları│
│  • Kartlarım: Üye işletme kartları │
│  • Fırsatlar: Kullanılabilir teklifler│
├─────────────────────────────────────┤
│  Bottom Navigation (5 Tab)          │
│  [Ana Sayfa | Yakınımda | Cüzdan |  │
│   Puan | Profil]                    │
└─────────────────────────────────────┘
```

---

## 2. Kuponlarım Tab

- **Kart Tipi:** Kupon Kartı (#FFFFFF kart, 16px radius, sol kesikli bilet çizgisi)
- **Sol Alan:** Büyük turuncu `#FF6B35` indirim değeri — "%20 İndirim"
- **İçerik:** Kupon başlığı, işletme adı, son geçerlilik ("2 gün kaldı")
- **CTA:** `#00B7EB` turkuaz buton "Kuponu kullan"
- **Boş Durum:** Empty State "Henüz kuponun yok" ("Fırsatları Keşfet" butonu)

---

## 3. Üyelik Kartlarım Tab

- TORBAA Dijital Üyelik Kartı ve anlaşmalı işletme sadakat kartları görsel temsili
- Kart üzerinde QR kod gösterimi (kendi sadakat kimliği)
- "Kart ekle / tanımla" seçeneği

---

## 4. Kullanılabilir Fırsatlar Tab

- Anlaşmalı restoranlarda geçerli yemek kartı bakiyesi veya özel indirim teklifleri
- Kullanım koşulları ve geçerlilik tarihleri
