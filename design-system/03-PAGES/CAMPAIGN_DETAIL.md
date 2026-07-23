# CAMPAIGN_DETAIL — Kampanya Detay Ekranı

> **Rota:** `/mobile/campaigns/[id]`  
> **App Bar:** Şeffaf overlay → Scroll'da opak  
> **İlke:** Kullanım koşulları, geçerlilik tarihi ve kazanım miktarı açıkça gösterilir.

---

## 1. Sayfa Düzeni

```text
┌─────────────────────────────────────┐
│  [Kampanya Büyük Görseli 16:9]      │
│  ← Geri                 ↗ Paylaş   │
├─────────────────────────────────────┤
│  Kampanya Bilgi Kartı (#FFFFFF)     │
│  Başlık (H1 Bold)                   │
│  İşletme Adı + Logo (inline)        │
│  📅 12 Tem – 30 Ağu 2026           │
│  ⏳ "2 gün kaldı" (countdown)       │
├─────────────────────────────────────┤
│  Puan Kazanım Bilgisi               │
│  ✨ "Bu harcamadan 250 puan kazan"  │
├─────────────────────────────────────┤
│  Kullanım Koşulları (Accordion)     │
│  • Min ₺100 harcama                 │
│  • Kişi başı 1 kullanım             │
│  • Sadece şube: Merkez              │
├─────────────────────────────────────┤
│  Kullanım Talimatları               │
│  1. İşletmeye git                   │
│  2. Kasiyere kupon kodunu göster    │
│  3. İndirimi otomatik al            │
├─────────────────────────────────────┤
│  Sabit Alt CTA                      │
│  ["Kuponu kullan" Primary #00B7EB]  │
└─────────────────────────────────────┘
```

---

## 2. Özellikler

- **Rozet:** Sol üst köşede turuncu `#FF6B35` fırsat rozeti ("%20 İndirim")
- **Puan Vurgusu:** `#FFF8DE` açık sarı kutu içinde `#F4B400` puan sarısı ile kazanım tutarı
- **Sabit Alt CTA:** `#00B7EB` turkuaz Primary Button tam genişlik ("Kuponu kullan")
- **Durumlar:**
  - Kullanılabilir: "Kuponu kullan" (#00B7EB)
  - Sona ermiş: Disabled — "Kampanya sona erdi"
  - Kullanılmış: Disabled — "Bu kupon kullanıldı ✓"
