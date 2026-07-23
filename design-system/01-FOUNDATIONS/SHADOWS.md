# SHADOWS — Gölge ve Elevation Seviyeleri

> **Yaklaşım:** Sıcak nötr tonlu, hafif ve düşük kontrastlı gölgeler.  
> **Baz Renk:** `rgba(16, 33, 43, x)` — neutral-950 bazlı yumuşak gölge

---

## 1. Elevation & Shadow Seviyeleri

| Seviye | Kullanım Alanı | Box Shadow |
|---|---|---|
| **Shadow SM** | Küçük kartlar, chip'ler, input focus | `0 2px 8px rgba(16, 33, 43, 0.05)` |
| **Shadow MD (Kart)** | Standart kartlar, kampanya kartları | `0 6px 20px rgba(16, 33, 43, 0.07)` |
| **Shadow LG (Yüzen)** | Alt navigasyon çubuğu, FAB | `0 -8px 28px rgba(16, 33, 43, 0.10)` |
| **Shadow XL (Modal)** | Modal, Bottom Sheet | `0 20px 50px rgba(16, 33, 43, 0.16)` |

---

## 2. Vurgu Glow Efektleri (Opsiyonel)

| Efekt | Kullanım | Box Shadow |
|---|---|---|
| **Brand Glow** | Aktif QR kodu, öne çıkan kampanya | `0 0 20px rgba(0, 183, 235, 0.20)` |
| **Puan Glow** | Toin bakiye vurgusu | `0 0 20px rgba(244, 180, 0, 0.20)` |
| **Kampanya Glow** | Öne çıkan fırsat kartı | `0 0 20px rgba(255, 107, 53, 0.20)` |

---

## 3. Kurallar

- Gölgeler hafif olmalıdır — ağır ve karanlık gölgeler kullanılmaz.
- Büyük yüzeylerde (modal, bottom sheet) gölge daha belirgin, küçük kartlarda daha yumuşak olmalıdır.
- Gradient yalnızca vurgu alanlarında ve kontrollü kullanılır.
