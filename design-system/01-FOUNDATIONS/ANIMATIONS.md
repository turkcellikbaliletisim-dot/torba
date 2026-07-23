# ANIMATIONS — Animasyon ve Geçiş Standartları

> **Zamanlama Fonksiyonları:** `cubic-bezier(0.4, 0, 0.2, 1)` (Standard Ease-InOut)  
> **Erişilebilirlik:** Hareket azaltma tercihi (`prefers-reduced-motion`) bulunan kullanıcılarda animasyonlar sadeleştirilir.

---

## 1. Zamanlama Skalası (Duration Tokens)

| Token | Süre (ms) | Kullanım Alanı |
|---|---|---|
| `duration-fast` | 150ms | Hover, press feedback, checkbox seçimi |
| `duration-normal`| 250ms | Dropdown açılma, toast mesajı, tab değişimi |
| `duration-slow`  | 350ms | Bottom Sheet yükselmesi, modal pop-up |
| `duration-page`  | 400ms | Sayfa geçişleri |

---

## 2. Tipik Animasyon Davranışları

- **Bottom Sheet:** Alttan yukarı kayma `translateY(100%) → translateY(0)` (350ms).
- **Modal Popup:** Merkezden ölçeklenme `scale(0.95) → scale(1)` + `opacity: 0 → 1` (250ms).
- **Skeleton Shimmer:** Soldan sağa hafif açık gradient kayması (1.5sn sonsuz döngü).
- **Button Press:** `scale(0.97)` basılma hissi (150ms).
- **Reduced Motion:** Animasyonlar kapatılır veya yalnızca `opacity` geçişine indirgenir.
