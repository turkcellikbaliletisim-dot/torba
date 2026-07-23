# TOAST — Bildirim Mesajı (Toast / Snackbar) Standartları

> **Konum:** Ekranın üst kısmı, Safe Area altında (`top: safe-area-inset-top + 16px`)  
> **Genişlik:** Ekranın %90'ı, max 400px  
> **Border Radius:** `radius-md` (12px)  
> **Gölge:** `0 6px 20px rgba(16, 33, 43, 0.10)`  
> **Otomatik Kapanma:** 3 saniye

---

## 1. Toast Varyantları

### 1.1 Başarılı (Success)
- **Arka Plan:** `#E8F8F1` (`success açık yüzeyi`)
- **Sol Kenarlık:** 3px solid `#16A56A` (`success ana`)
- **İkon:** `CheckCircle` (20px, `#16A56A`)
- **Başlık:** "Kupon kullanıldı!" — `Body Medium`, `#0B6B45`
- **Açıklama:** "250 puan hesabına eklendi." — `Caption`, `#647681`

### 1.2 Hata (Error)
- **Arka Plan:** `#FDEDEF` (`error açık yüzeyi`)
- **Sol Kenarlık:** 3px solid `#E34D59` (`error ana`)
- **İkon:** `XCircle` (20px, `#E34D59`)
- **Başlık:** "Kupon geçersiz" — `Body Medium`, `#A62934`
- **Açıklama:** "Bu kuponun süresi dolmuş." — `Caption`

### 1.3 Bilgi (Info)
- **Arka Plan:** `#EAF2FD` (`info açık yüzeyi`)
- **Sol Kenarlık:** 3px solid `#2C7BE5` (`info ana`)
- **İkon:** `Info` (20px, `#2C7BE5`)
- **Başlık:** "Yakınında 3 yeni fırsat var!" — `Body Medium`, `#1F5CA8`

### 1.4 Puan Kazanımı (Points Toast)
- **Arka Plan:** `#FFF8DE` (`puan açık yüzeyi`)
- **Sol Kenarlık:** 3px solid `#F4B400` (`puan sarısı`)
- **İkon:** `Sparkles` (20px, `#F4B400`)
- **Başlık:** "+ 250 Puan Kazandın!" — `Body Medium`, `#7A5900`

---

## 2. Animasyon & Etkileşim

- **Giriş:** Üstten aşağı kayma `translateY(-100%) → translateY(0)` + `opacity(0 → 1)` (250ms)
- **Çıkış:** Yukarı kayma `translateY(0) → translateY(-100%)` (200ms)
- Sağa/sola kaydırma (swipe) ile manuel kapatma desteklenir
