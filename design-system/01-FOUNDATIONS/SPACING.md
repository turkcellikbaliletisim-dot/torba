# SPACING — Grid, Boşluk ve Layout Standartları

> **Grid Sistemi:** 4px Tabanlı  
> **Dokunma Hedefi (Touch Target):** Minimum 44×44 px  
> **Mobil Referans:** 390 × 844 px

---

## 1. Boşluk Skalası (Spacing Tokens)

| Token | Değer (px) | Kullanım Örneği |
|---|---|---|
| `space-1` | 4px | İkon-metin arası min boşluk, rozet içi padding |
| `space-2` | 8px | Küçük elementler arası, chip padding |
| `space-3` | 12px | Kartlar arası küçük boşluk |
| `space-4` | 16px | Kartlar arası standart boşluk, form element gap |
| `space-5` | 20px | **Sayfa yatay kenar boşluğu (horizontal padding)** |
| `space-6` | 24px | Bölümler arası dikey boşluk |
| `space-8` | 32px | Büyük bölümler arası dikey boşluk |
| `space-10` | 40px | Hero alanları |

---

## 2. Ekran Yapısı

- **Yatay Sayfa Boşluğu (Container Padding):** `20px` her iki yanda
- **Kartlar Arası Boşluk:** `12px` veya `16px`
- **Bölümler Arası Boşluk:** `24px` veya `32px`
- **Alt Navigasyon Yüksekliği:** `72–80px` + Safe Area (`env(safe-area-inset-bottom)`)
- **Safe Area Top:** `env(safe-area-inset-top)`

---

## 3. Breakpoints

- **Mobile:** `< 640px` (Tek kolonlu dikey akış)
- **Tablet:** `640px – 1024px` (2-3 kolonlu grid)
- **Desktop (Paneller):** `> 1024px` (Sol sabit sidebar + içerik alanı)
