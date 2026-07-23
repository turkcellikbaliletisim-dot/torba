# BOTTOM_NAVIGATION — Mobil Alt Navigasyon Çubuğu

> **Yükseklik:** 72–80px + Safe Area (`env(safe-area-inset-bottom)`)  
> **Arka Plan:** `#FFFFFF` (`white`)  
> **Üst Kenarlık:** `1px solid #DCE6EB` (`neutral-200`)  
> **Gölge:** `0 -8px 28px rgba(16, 33, 43, 0.10)`

---

## 1. Mobil 5 Sekme (Main Navigation)

| Sıra | Sekme Adı | Pasif İkon | Aktif İkon | Rota |
|:---:|---|---|---|---|
| 1 | **Ana Sayfa** | `Home` (stroke) | `Home` (filled) | `/mobile` |
| 2 | **Yakınımda** | `MapPin` (stroke) | `MapPin` (filled) | `/mobile/nearby` |
| 3 | **Cüzdan** | `Wallet` (stroke) | `Wallet` (filled) | `/mobile/wallet` |
| 4 | **Puan** | `Sparkles` (stroke) | `Sparkles` (filled) | `/mobile/points` |
| 5 | **Profil** | `User` (stroke) | `User` (filled) | `/mobile/profile` |

---

## 2. Görsel Durumlar

- **Pasif Sekme:** İkon `#647681` (`neutral-600`), etiket `Caption` (12px), `#647681`
- **Aktif Sekme:** İkon `#00B7EB` (`brand-500`), etiket `Caption SemiBold`, `#00B7EB`
- **Aktif Gösterge:** Sekme üzerinde `#00B7EB` renginde hafif çizgi veya renk vurgusu

---

## 3. Animasyon

- Sekme değişiminde ikon `scale(1.0) → scale(1.15) → scale(1.0)` yay animasyonu (200ms)
- Hareket azaltma tercihi (`prefers-reduced-motion`) olan kullanıcılarda animasyon sadeleştirilir

---

## 4. Bildirim Rozeti (Count Badge)

- Cüzdan veya Puan sekmesinde yeni kazanım/kupon varsa sağ üstte küçük kırmızı daire badge (`#E34D59`)
