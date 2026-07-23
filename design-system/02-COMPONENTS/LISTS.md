# LISTS — Liste Elemanı Standartları

> **Satır Yüksekliği:** Minimum 64px (tek satır), 80px (iki satır detaylı)  
> **Ayırıcı:** `border-b border-neutral-200` (`#DCE6EB`)  
> **Press:** Arka plan `#F1FBFE` (`brand-50`)

---

## 1. İşletme Liste Elemanı (Merchant List Item)

| Alan | Konum | Detay |
|---|---|---|
| **Logo** | Sol, 48×48 px | Kare, `radius-md` (12px) |
| **İşletme Adı** | Orta-üst | `Subtitle 1` (16px Medium, `#10212B`) |
| **Kategori + Mesafe**| Orta-alt | `Caption` — "Restoran · 350m", `#647681` |
| **Puan** | Sağ-üst | `Star` + "4.7", `#F4B400` |
| **Kampanya Sayısı** | Sağ-alt | "2 kampanya", `#FF6B35` (Turuncu), `Caption` |

---

## 2. Kupon Liste Elemanı (Coupon List Item)

| Alan | Konum | Detay |
|---|---|---|
| **İndirim Değeri** | Sol daire içinde | `H2 Bold`, `#FF6B35` — "%20" |
| **Kupon Başlığı** | Orta-üst | `Subtitle 1` |
| **İşletme Adı** | Orta-alt | `Caption`, `#647681` |
| **Süre** | Sağ | "2 gün kaldı", `#F4A62A`, `Caption` |

---

## 3. İşlem Geçmişi Liste Elemanı (Transaction List Item)

| Alan | Konum | Detay |
|---|---|---|
| **İkon** | Sol, 40×40 daire | `ArrowUpRight` (harcama, Red), `ArrowDownLeft` (puan kazanım, Yellow `#F4B400`), `RotateCcw` (iade, Blue) |
| **Başlık** | Orta-üst | "Restoran XYZ'de Ödeme" — `Subtitle 1` |
| **Tarih** | Orta-alt | "23 Tem 2026 · 13:45" — `Caption`, `#647681` |
| **Tutar** | Sağ-üst | "- ₺125,00" veya "+ 250 Puan" (#F4B400) — `Body Medium` |
| **Durum** | Sağ-alt | Tamamlandı (#16A56A), Bekliyor (#F4A62A), İptal (#E34D59) — `Caption` |

---

## 4. Bildirim Liste Elemanı (Notification List Item)

| Alan | Konum | Detay |
|---|---|---|
| **İkon** | Sol, 36×36 daire | `Bell`, `Gift`, `AlertTriangle` |
| **Başlık** | Orta-üst | "Yeni kampanya: %15 indirim!" — `Subtitle 1` |
| **Açıklama** | Orta-alt | Kısa açıklama — `Caption`, `#647681`, max 2 satır |
| **Zaman** | Sağ | "2 dk önce" — `Caption`, `#9AAAB3` |
| **Okunmamış** | Sol kenarda 4px Turkuaz (`#00B7EB`) çizgi |
